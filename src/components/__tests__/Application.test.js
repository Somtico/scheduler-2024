import React from "react";

import {
  render,
  cleanup,
  fireEvent,
  findByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  getByText,
  queryByText,
  getByTestId,
  findByAltText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { queryByText, getByText, findByText } = render(<Application />);

    return findByText("Monday").then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(queryByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Click the "Add" button on the first empty appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    // 5. Click the first interviewer in the list.
    const interviewers = getAllByTestId(appointment, "interviewers");
    const interviewer = interviewers[1];

    fireEvent.click(getByTestId(interviewer, "interviewer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(queryByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await findByText(appointment, "Lydia Miller-Jones");

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen");

    // 3. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();

    // 4. Click the "Delete" button on the first booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    // 5. Check that the element with the text "Are you sure you would like to delete?" is displayed.
    expect(
      queryByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    // 6. Click the "Confirm" button.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 7. Check that the element with the text "Deleting" is displayed.
    expect(queryByText(container, "Deleting")).toBeInTheDocument();

    // 8. Wait until the element with the "Add" button is displayed.
    await findByAltText(appointment, "Add");

    // 9. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    expect(queryByText(day, "2 spots remaining")).toBeInTheDocument();
  });
});
