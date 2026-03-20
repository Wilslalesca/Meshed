import { sendEmail } from "./emailService";
import { EventModel } from "../models/EventModel";
import { FacilityModel } from "../models/FacilityModel";
import { EventEmailLogModel } from "../models/EventEmailLogModel";

function formatDate(date: Date | string | null) {
    if (!date) return "";

    return new Date(date).toISOString().split("T")[0];
}


export class EventEmailService {

    static async sendBookingConfirmationEmail(eventId: string) {
        const event = await EventModel.getById(eventId);
        if (!event) return;
        if (!event.team_facility_id) return;

        const facility = await FacilityModel.findById(event.team_facility_id);
        if (!facility) return;
        if (!facility.email) return;

        const updatedStatusEmail = await EventEmailLogModel.tryCreateLog(eventId, "booking_confirmation", facility.email);
        if (!updatedStatusEmail) return;

        await sendEmail.sendBookingConfirmationEmail(
            facility.email,
            facility.name,
            event.requested_by_name,
            event.name,
            event.type,
            formatDate(event.start_date),
            formatDate(event.end_date),
            event.start_time,
            event.end_time,
            event.notes
        );
    }

    static async sendBookingStatusUpdateEmail(eventId: string) {
        const event = await EventModel.getById(eventId);
        if (!event || !event.requested_by_email || !event.team_facility_id || !event.status) return;

        const normStatus = String(event.status).toUpperCase();
        if (normStatus !== "APPROVED" && normStatus !== "DENIED") return;

        const facility = await FacilityModel.findById(event.team_facility_id);
        const facilityName = facility ? facility.name : "Facility";

        const emailType = normStatus === "APPROVED" ? "booking_approval" : "booking_denial";
        const updatedStatusEmail = await EventEmailLogModel.tryCreateLog(eventId, emailType, event.requested_by_email);

        if (!updatedStatusEmail) return;

        await sendEmail.sendBookingStatusEmail(
            event.requested_by_email,
            facilityName,
            event.name,
            formatDate(event.start_date),
            event.start_time,
            event.end_time,
            normStatus,
            event.facility_notes
        );

    }
}