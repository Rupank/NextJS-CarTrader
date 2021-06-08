import { Grid } from "@material-ui/core";
import { GetServerSideProps } from "next";
import Search from ".";
import { CarModel } from "../../api/Car";
import Link from "next/link";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModel";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { getAsString } from "../getAsString";
import { useRouter } from "next/router";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { PaginationRenderItemParams } from "@material-ui/lab";
import useSWR from "swr";
import { ParsedUrlQuery, stringify } from "querystring";
import { forwardRef, useState } from "react";
import deepEqual from "deep-equal";
import { CarCard } from "../components/CarCard";
export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}
export default function CarsList({
  makes,
  models,
  cars,
  totalPages,
}: CarsListProps) {
  const { query } = useRouter();
  const [serverQuery] = useState(query);
  const { data } = useSWR("/api/cars?" + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  });
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid item xs={12} sm={7} md={9} lg={10}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Pagination
              page={parseInt(getAsString(query.page || "1"))}
              count={data?.totalPages}
              renderItem={(item) => (
                <PaginationItem
                  component={MaterialUILink}
                  query={query}
                  item={item}
                  {...item}
                />
              )}
            />
          </Grid>
          {(data?.cars || []).map((car) => (
            <Grid key={car.id} item xs={12} sm={6}>
              <CarCard car={car} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
export interface MaterialUILinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

const MaterialUILink = forwardRef<HTMLAnchorElement, MaterialUILinkProps>(
  ({ item, query, ...props }, ref) => (
    <Link
      href={{
        pathname: "/cars",
        query: { ...query, page: item.page },
      }}
      shallow
    >
      <a {...props}></a>
    </Link>
  )
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make || "");
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);
  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};
