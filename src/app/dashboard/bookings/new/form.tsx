"use client";

import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TAPIUsersSearchGETResponse,
  TAPIUsersSearchUserData,
} from "@/schemas/api/users/search";
import { toTitleCase } from "@/utils/string";

import { CalendarIcon } from "lucide-react";

import {
  CreateBookingInput,
  CreateBookingBody,
  CreateBookingSchema,
} from "@/schemas/booking";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { AsyncMultiCombobox } from "@/components/async-multi-combobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TVenue = {
  id: string;
  name: string;
  type: string;
};

async function fetchUsers(
  query: string,
  signal: AbortSignal,
): Promise<TAPIUsersSearchUserData[]> {
  const res = await fetch(
    `/api/users/search?by=name,email&query=${encodeURIComponent(query)}`,
    { signal },
  );
  const data: TAPIUsersSearchGETResponse = await res.json();
  if (data.status !== "SUCCESS")
    throw new Error("Failed to fetch users: " + data.error.message);

  return data.data;
}

export default function NewBookingFormComponent({
  venues,
}: {
  venues: TVenue[];
}) {
  const groupedVenues = venues.reduce<Record<string, typeof venues>>(
    (acc, venue) => {
      (acc[venue.type] ||= []).push(venue);
      return acc;
    },
    {},
  );

  const form = useForm<CreateBookingInput, unknown, CreateBookingBody>({
    resolver: zodResolver(CreateBookingSchema),
    defaultValues: {
      venue_id: "",
      reason: "",
      date_range: undefined,
      from_time: "10:00:00",
      to_time: "18:30:00",
      accompanying_members: [],
    },
  });

  function onSubmit(data: CreateBookingBody) {
    // TODO: Finish submission & create alert
    console.log(data);
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">New Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* TODO: Implement multiple venue selection */}
            <Controller
              name="venue_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form_booking-new_field-venue">
                    Venue
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form_booking-new_field-venue"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(groupedVenues).map(
                        ([type, venues], index) => (
                          <div key={type}>
                            <SelectGroup key={type}>
                              <SelectLabel>
                                {toTitleCase(type.replace("_", " "))}
                              </SelectLabel>

                              {venues.map((venue) => (
                                <SelectItem key={venue.id} value={venue.id}>
                                  {venue.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            {index !==
                              Object.entries(groupedVenues).length - 1 && (
                              <SelectSeparator />
                            )}
                          </div>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="date_range"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form_booking-new_field-date_range">
                    Date Range
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="form_booking-new_field-date_range"
                        className="justify-start px-2.5 font-normal"
                      >
                        <CalendarIcon />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "LLL dd, y")} -{" "}
                              {format(field.value.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* TODO: Fix default time */}
            <div className="grid gap-8 md:grid-cols-2">
              <Controller
                name="from_time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form_booking-new_field-from_time">
                      From Time
                    </FieldLabel>
                    <Input
                      {...field}
                      required
                      type="time"
                      id="form_booking-new_field-from_time"
                      step={60}
                      aria-invalid={fieldState.invalid}
                      className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="to_time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form_booking-new_field-to_time">
                      To Time
                    </FieldLabel>
                    <Input
                      {...field}
                      required
                      type="time"
                      id="form_booking-new_field-to_time"
                      step={60}
                      aria-invalid={fieldState.invalid}
                      className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="accompanying_members"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="form_booking-new_field-accompanying_members">
                    Accompanying Members
                  </FieldLabel>
                  <AsyncMultiCombobox<TAPIUsersSearchUserData>
                    id="form_booking-new_field-accompanying_members"
                    value={field.value}
                    onChange={field.onChange}
                    fetchItems={fetchUsers}
                    itemKey={(u) => u.email}
                    itemToString={(u) => `${u.name ?? u.email} <${u.email}>`}
                    placeholder="Search people..."
                    errorMessage={fieldState.error?.message}
                    renderItem={(u) => (
                      <Item size="sm" className="p-1">
                        <ItemMedia>
                          <Avatar>
                            <AvatarImage src={u.image ?? undefined} />
                            <AvatarFallback>
                              {u.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{u.name ?? "-"}</ItemTitle>
                          <ItemDescription>{u.email}</ItemDescription>
                        </ItemContent>
                      </Item>
                    )}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="reason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form_booking-new_field-reason">
                    Reason
                  </FieldLabel>
                  <Input
                    {...field}
                    required
                    id="form_booking-new_field-reason"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit" className="mt-4">
              Create Booking
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
