const EnquiryStatusesLog = require("../Database/Models/Sales/enquiryLogs.model");
const QuotationLog = require("../Database/Models/Sales/quotationLog");
const DB = require("./crud.helper");
const Logger = require("../Helpers/logger");
const fileName = "dbLogHelper.js";

// -=-=-=-=-=-=-=-=-=-=- booking logs -=-=-=-=-=-=-=-=-=-=-=-=-

const makeBookingLog = async (data) => {
  try {
    await DB.create(BookingLog, data);
    return true;
  } catch (error) {
    Logger.error(error.message + "at makeBookingLog function " + fileName);
  }
};

const readBookingLog = async (query) => {
  try {
    const bookingLogs = await DB.findDetails(BookingLog, query);
    return bookingLogs;
  } catch (error) {
    Logger.error(error.message + "at readBookingLog function " + fileName);
  }
};

// -=-=-=-=-=-=-=-=-=-=- end of booking logs -=-=-=-=-=-=-=-=-=-=-=-=-

// -=-=-=-=-=-=-=-=-=-=- fml logs -=-=-=-=-=-=-=-=-=-=-=-=-

const makeFMLStatuesLog = async (data) => {
  try {
    await DB.create(FmlStatusesLog, data);
    return true;
  } catch (error) {
    Logger.error(error.message + "at makeFMLStatuesLog function " + fileName);
  }
};

const readFMlStatusesLog = async (query) => {
  try {
    const fmlLogs = await DB.population(FmlStatusesLog, {
      queryString: query,
      popString: "fieldExecutive",
    });

    return fmlLogs;
  } catch (error) {
    Logger.error(error.message + "at readFMlStatusesLog function " + fileName);
  }
};

// -=-=-=-=-=-=-=-=-=-=- end fml logs -=-=-=-=-=-=-=-=-=-=-=-=-

// -=-=-=-=-=-=-=-=-=-=- enquiry logs -=-=-=-=-=-=-=-=-=-=-=-=-

const makeEnquiryStatusLog = async (data) => {
  try {
    const enquiryStatuesLog = await DB.create(EnquiryStatusesLog, data);
    return enquiryStatuesLog;
  } catch (error) {
    Logger.error(
      error.message + "at makeEnquiryStatusLog function " + fileName
    );
  }
};

const readEnquiryStatusesLog = async (query) => {
  try {
    const enquiryLogs = await DB.findDetails(EnquiryStatusesLog, query);
    return enquiryLogs;
  } catch (error) {
    Logger.error(
      error.message + "at readEnquiryStatusesLog function " + fileName
    );
  }
};

// -=-=-=-=-=-=-=-=-=-=- end enquiry logs -=-=-=-=-=-=-=-=-=-=-=-=-

// -=-=-=-=-=-=-=-=-=-=- quotation logs -=-=-=-=-=-=-=-=-=-=-=-=-

const makeQuoationLog = async (data) => {
  try {
    await DB.create(QuotationLog, data);
    return true;
  } catch (error) {
    Logger.error(error.message + "at makeQuoationLog function " + fileName);
  }
};

const readQuotationLog = async (query) => {
  try {
    const quotationLogs = await DB.findDetails(QuotationLog, query);
    return quotationLogs;
  } catch (error) {
    Logger.error(error.message + "at readQuotationLog function " + fileName);
  }
};

// -=-=-=-=-=-=-=-=-=-=- end quotation logs -=-=-=-=-=-=-=-=-=-=-=-=-

// ---------------------------- job log ---------------------------------

const makeJobLog = async (data) => {
  try {
    await DB.create(JobLog, data);
    return true;
  } catch (error) {
    Logger.error(error.message + "at makeJobLog function " + fileName);
  }
};

const readJobLog = async (query) => {
  try {
    const jobLog = await DB.findDetails(JobLog, query);
    return jobLog;
  } catch (error) {
    Logger.error(error.message + "at readJobLog function " + fileName);
  }
};

// -=-=-=-=-=-=-=-=-=-=- end job logs -=-=-=-=-=-=-=-=-=-=-=-=-

// -=-=-=-=-=-=-=-=-=-=- lmd logs -=-=-=-=-=-=-=-=-=-=-=-=-

const makeLmdLog = async (data) => {
  try {
    await DB.create(LmdLog, data);
    return true;
  } catch (error) {
    Logger.error(error.message + "at makeLmdLog function " + fileName);
  }
};

const readLmdLog = async (query) => {
  try {
    const jobLog = await DB.population(LmdLog, {
      queryString: query,
      popString: "fieldExecutive",
    });
    return jobLog;
  } catch (error) {
    Logger.error(error.message + "at readLmdLog function " + fileName);
  }
};

// -=-=-=-=-=-=-=-=-=-=- end lmd logs -=-=-=-=-=-=-=-=-=-=-=-=-
module.exports = {
  makeFMLStatuesLog,
  readFMlStatusesLog,
  makeEnquiryStatusLog,
  readEnquiryStatusesLog,
  makeBookingLog,
  readBookingLog,
  makeQuoationLog,
  readQuotationLog,
  makeJobLog,
  readJobLog,
  makeLmdLog,
  readLmdLog,
};
