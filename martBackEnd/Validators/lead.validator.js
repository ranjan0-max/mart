const Joi = require("joi");
const { IST } = require("../Helpers/dateTime.helper");

const getDate = () => {
    const date = IST();
    return date.split(" ")[0];
};

const leadSchema = Joi.object({
    phone: Joi.string().required().min(10).max(10)
        .regex(/^[6-9]\d{9}$/)
        .message("please enter a valid phone number, starts with: 6, 7, 8, 9, min digit: 10, max digit: 10"),
    email: Joi.string().email().allow("", null),
    name: Joi.object({
        salutation: Joi.string().min(2).max(3).required(),
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
    }),
    dateOfBirth: Joi.date(),
    anniversary: Joi.date(),
    address: Joi.string().min(4),
    city: Joi.string().min(3),
    alternatePhone: Joi.string()
        .min(10)
        .max(10)
        .allow(null, "")
        .regex(/^[6-9]\d{9}$/)
        .message("please enter a valid phone number, starts with: 6, 7, 8, 9, min digit: 10, max digit: 10"),
    alternateEmail: Joi.string().email().allow(null, ""),
    customerType: Joi.string().min(3).required(),
    leadSource: Joi.string().min(3).required(),
    leadPriority: Joi.string().required().min(3).required(),
    leadStatus: Joi.string().required().min(3).required(),
    adults: Joi.number().min(1).max(1000).required(),
    childrenTwoFive: Joi.number().min(0).max(1000),
    childrenFiveTwelve: Joi.number().min(0).max(1000),
    infants: Joi.number().min(0).max(1000),
    tripType: Joi.string().min(3),
    tags: Joi.array().items(Joi.string()).allow(null),
    assignedTo: Joi.string().allow(null, ""),
    enquiryType: Joi.array().items(Joi.string()).allow(null),
    reminder: Joi.object({
        status: Joi.boolean(),
        description: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.string().required().min(3).max(600),
            otherwise: Joi.string().regex(/^$/).allow(null, "")
                .message("description should be an empty string"),
        }),
        date: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.date().min(getDate()).iso().raw(),
            otherwise: Joi.string().regex(/^$/).allow(null, "")
                .message("date should be an empty string"),
        }),
    }),
    attachment: Joi.array().items(Joi.string().allow(null, "").min(15)),
    notes: Joi.string().max(400).allow(null, ""),

    flightBooking: Joi.array().items(Joi.object({
        fromCity: Joi.object({ id: Joi.number().required(), name: Joi.string().required() }),
        toCity: Joi.object({ id: Joi.number().required(), name: Joi.string().required() }),
        departureDate: Joi.date().required(),
        returnDate: Joi.date().allow(null, ""),
        class: Joi.string().required().min(3),
        category: Joi.string().required().min(3),
        flexibility: Joi.string().allow(null),
        preference: Joi.string().allow(null),
    })),

    hotelBooking: Joi.array().items(Joi.object({
        status: Joi.boolean(),
        country: Joi.object({ id: Joi.number(), name: Joi.string() }).required(),
        city: Joi.object({ id: Joi.number(), name: Joi.string() }).required(),
        roomType: Joi.string().required(),
        starRating: Joi.number().allow(null, ""),
        checkIn: Joi.date().required(),
        checkOut: Joi.date().required(),
        numberOfNights: Joi.number().required(),
        budget: Joi.number().allow(null, ""),
        hotel: Joi.string().allow(null, ""),
        numberOfRooms: Joi.number().required(),

    })),
    visa: Joi.array().items(Joi.object({
        country: Joi.object({ id: Joi.number(), name: Joi.string() }).required(),
        visaCategory: Joi.string().required(),
        visitType: Joi.string().required(),
        duration: Joi.number().required(),
        durationType: Joi.string().required(),
        travelDate: Joi.date().required(),
        jobProfile: Joi.string().required(),
        age: Joi.number().required(),
        qualification: Joi.string().allow(null, ""),
        description: Joi.string().allow(null, ""),

    })),
    travelInsurance: Joi.array().items(Joi.object({
        country: Joi.object({
            name: Joi.string(),
            id: Joi.number(),
        }).required(),
        duration: Joi.string().required(),
        travelDate: Joi.date().required(),
        visaInsurance: Joi.boolean(),
    })),
    forex: Joi.array().items(Joi.object({
        country: Joi.object({
            name: Joi.string(),
            id: Joi.number(),
        }).required(),
        amount: Joi.string().required(),
    })),
    sightseeing: Joi.array().items(Joi.object({
        title: Joi.string().allow(null, ""),
        activity: Joi.string().allow(null, ""),
        country: Joi.object({
            id: Joi.number(),
            name: Joi.string(),
        }).required(),
        city: Joi.object({
            id: Joi.number(),
            name: Joi.string(),
        }).required(),
        day: Joi.number(),
        meal: Joi.array().items(Joi.string()),
        sightSeeingOptions: Joi.array().items(Joi.string()).required(),
        preferences: Joi.string().allow(null, ""),
        travelDate: Joi.date().required(),
    })),
    transport: Joi.array().items(Joi.object({
        country: Joi.object({
            id: Joi.number(),
            name: Joi.string(),
        }).required(),
        city: Joi.object({
            id: Joi.number(),
            name: Joi.string(),
        }).required(),
        transportDate: Joi.date().required(),
        dropDate: Joi.date().required(),
        transporter: Joi.string().required(),
        vehicles: Joi.array().items(Joi.string()).required(),
        transportType: Joi.string(),
        preference: Joi.string(),
        other: Joi.string().allow(null),
    })),
    other: Joi.object({
        status: Joi.boolean(),
        country: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.object({
                name: Joi.string(),
                id: Joi.number(),
            }).required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        states: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.array().items(Joi.object({
                name: Joi.string(),
                id: Joi.number(),
            })).required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        travelDate: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.date().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        numberOfDays: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.number().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        subCategory: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.string(),
            otherwise: Joi.string().valid(null, ""),
        }),
        description: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.string().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
    }),
    package: Joi.object({
        status: Joi.boolean(),
        startDate: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.date().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        endDate: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.date().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        budget: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.number().allow(null, ""),
            otherwise: Joi.string().valid(null, ""),
        }),
        children: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.number().allow(null, ""),
            otherwise: Joi.string().valid(null, ""),
        }),
        childrenAge: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.array().items(Joi.number()).allow(null),
            otherwise: Joi.string().valid(null, ""),
        }),
        edited: Joi.boolean(),
        country: Joi.object({
            id: Joi.number(),
            name: Joi.string(),
        }),
        state: Joi.object({
            id: Joi.number(),
            name: Joi.string(),
        }),
        packageId: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.string().required().min(6),
            otherwise: Joi.string().valid(null, ""),
        }),
        packageData: Joi.alternatives().conditional("edited", {
            is: true,
            then: Joi.object(),
            otherwise: Joi.object(),
        }),
        itinerary: Joi.array().items(Joi.object({
            title: Joi.string(),
            placeName: Joi.string().allow("", null),
            meal: Joi.array().items(Joi.string()),
            city: Joi.object({
                id: Joi.number(),
                name: Joi.string(),
                state_name: Joi.string(),
            }),
            day: Joi.number().required(),
            details: Joi.string().allow("", null),
            sightSeeing: Joi.array().items(Joi.string()),
            hotel: Joi.string().allow("", null),
            rooms: Joi.array().items({
                _id: Joi.string().allow(null, ""),
                roomType: Joi.string().allow(null, ""),
                roomCount: Joi.number().allow(null, ""),
                hotelId: Joi.string().allow(null, ""),
                price: Joi.number().allow(null, ""),
                capacity: Joi.number().allow(null, ""),
            }),
            transporter: Joi.string().allow("", null),
            vehicles: Joi.array().items(Joi.string()),
        })),
    }),
    customizePackage: Joi.object({
        status: Joi.boolean(),
        country: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.object({
                name: Joi.string(),
                id: Joi.number(),
            }).required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        choice: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.string().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        cityStay: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.alternatives().conditional(
                "choice",
                {
                    is: "Countries & Cities",
                    then: Joi.array().items(Joi.object({
                        id: Joi.number(),
                        city: Joi.object({
                            name: Joi.string(),
                            id: Joi.number(),
                        }),
                        stayNights: Joi.number(),
                    })),
                    otherwise: Joi.array(),
                },
            ),
            otherwise: Joi.string().valid(null, ""),
        }),
        services: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.array().items(Joi.string()),
            otherwise: Joi.string().valid(null, ""),
        }),
        hotelRating: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.number(),
            otherwise: Joi.string().valid(null, ""),
        }),
        travelDate: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.date().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        numberOfRooms: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.number(),
            otherwise: Joi.string().valid(null, ""),
        }),
        flexibility: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.string().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        preference: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.string().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
        budget: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.number(),
            otherwise: Joi.string().valid(null, ""),
        }),
        description: Joi.alternatives().conditional("status", {
            is: true,
            then: Joi.string().required(),
            otherwise: Joi.string().valid(null, ""),
        }),
    }),

    payments: Joi.array().items(Joi.object({
        leadId: Joi.string().allow("", null),
        count: Joi.number().allow("", null),
        billNumber: Joi.string().allow("", null),
        name: Joi.string().allow("", null),
        sumOfRupees: Joi.string().allow("", null),
        advance: Joi.number().allow("", null),
        balance: Joi.number().allow("", null),
        totalAmount: Joi.number().allow("", null),
        method: Joi.string().allow("", null),
        cash: Joi.boolean(),
        cheque: Joi.boolean(),
        online: Joi.boolean(),
        paymentDate: Joi.date().allow("", null),
        receiptDate: Joi.date().allow("", null),
        full: Joi.boolean(),
        part: Joi.boolean(),
        advancePay: Joi.boolean(),
        againstBillNo: Joi.string().allow("", null),
        verified: Joi.boolean(),
        rejected: Joi.boolean(),
        verifiedBy: Joi.string().allow("", null),
        createdBy:  Joi.string().allow("", null),
    })),
    whatsappOptIn: Joi.boolean(),
    dateOfBirth: Joi.date().allow(null, ""),
    anniversary: Joi.date().allow(null, ""),
});

module.exports = leadSchema;
