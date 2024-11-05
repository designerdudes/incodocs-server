import { SendMailClient } from "zeptomail";
import dotenv from 'dotenv'
dotenv.config();

// Set the URL and token for the ZeptoMail API
const url = process.env.ZOHO_URL;
const token = process.env.ZOHO_TOKEN;

const {
  ZEPTO_MAIL_TEMPLATE_OTP,
  ZEPTO_MAIL_TEMPLATE_WELCOME,
  ZEPTO_MAIL_TEMPLATE_ORGANIZATION_CREATED,
  ZEPTO_MAIL_TEMPLATE_NEW_SHIPMENT,
  ZEPTO_MAIL_TEMPLATE_NEW_CONTAINER,
  ZEPTO_MAIL_TEMPLATE_SHIPMENT_STATUS
} = process.env;

// Initialize the SendMailClient with the URL and token
let client = new SendMailClient({ url, token });

const extractNameFromEmail = (email) => {
  const namePart = email.split("@")[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};

export const sendEmailWithTemplate = async (
  toAddress,
  toName,
  subject,
  mergeInfo = {}
) => {
  const name = toName || extractNameFromEmail(toAddress);
  console.log("token", ZEPTO_MAIL_TEMPLATE_OTP);
  const emailDetails = {
    mail_template_key: ZEPTO_MAIL_TEMPLATE_OTP,
    from: {
      address: "noreply@designerdudes.in",
      name: "DesignerDudes Pvt. Ltd.",
    },
    to: [
      {
        email_address: {
          address: toAddress,
          name: name,
        },
      },
    ],
    subject: subject,
    merge_info: mergeInfo,
  };

  try {
    const resp = await client.sendMail(emailDetails);
    console.log("Email sent successfully:", resp);
  } catch (error) {
    console.error("Error sending email:", error.error);
  }
};

export const sendOtpEmail = async (toAddress, userName, otp) => {
  const name = userName || extractNameFromEmail(toAddress);
  const subject = "Your One Time Password for Login";
  const templateKey = ZEPTO_MAIL_TEMPLATE_OTP;
  const mergeInfo = { OTP: otp, userName: name };
  await sendEmailWithTemplate(toAddress, name, subject, templateKey, mergeInfo);
};

//ZEPTO_MAIL_TEMPLATE_WELCOME
export const sendWelcomeEmail = async (toAddress, userName, userId) => {
  const name = userName || extractNameFromEmail(toAddress);
  const subject = "Welcome to Incodocs";
  const templateKey = ZEPTO_MAIL_TEMPLATE_WELCOME;
  const mergeInfo = { userName: name, userId: userId };
  await sendEmailWithTemplate(
    toAddress,
    userName,
    subject,
    templateKey,
    mergeInfo
  );
};

//ZEPTO_MAIL_TEMPLATE_ORGANIZATION_CREATED
export const sendOrgCreatedEmail = async (toAddress, owner, OrganizationId) => {
  // const name = userName || extractNameFromEmail(toAddress);
  const subject = "organization created successfully";
  const templateKey = ZEPTO_MAIL_TEMPLATE_ORGANIZATION_CREATED;
  const mergeInfo = { owner: owner, OrganizationId: OrganizationId };
  await sendEmailWithTemplate(
    toAddress,
    userName,
    subject,
    templateKey,
    mergeInfo
  );
};

// ZEPTO_MAIL_TEMPLATE_NEW_SHIPMENT
export const sendShipmentCreatedEmail = async (toAddress, userName, shipmentId) => {
  const name = userName || extractNameFromEmail(toAddress);
  const subject = "your shipment created successfully";
  const templateKey = ZEPTO_MAIL_TEMPLATE_NEW_SHIPMENT;
  const mergeInfo = { userName:userName, name:name, shipmentId: shipmentId };
  await sendEmailWithTemplate(
    toAddress,
    userName,
    subject,
    templateKey,
    mergeInfo
  );
};

// ZEPTO_MAIL_TEMPLATE_NEW_CONTAINER
export const sendNewContainerEmail = async (toAddress, container, shipmentId) => {
  const name = userName || extractNameFromEmail(toAddress);
  const subject = "new container added successfully";
  const templateKey = ZEPTO_MAIL_TEMPLATE_NEW_CONTAINER
  const mergeInfo = { container: container, name:name, shipmentId: shipmentId };
  await sendEmailWithTemplate(
    toAddress,
    userName,
    subject,
    templateKey,
    mergeInfo
  );
};

// ZEPTO_MAIL_TEMPLATE_SHIPMENT_STATUS
export const sendShipmentStatusEmail = async (toAddress, userName, shipmentId) => {
  const name = userName || extractNameFromEmail(toAddress);
  const subject = "shipment status";
  const templateKey = ZEPTO_MAIL_TEMPLATE_SHIPMENT_STATUS
  const mergeInfo = { userName:userName, name:name, shipmentId: shipmentId };
  await sendEmailWithTemplate(
    toAddress,
    userName,
    subject,
    templateKey,
    mergeInfo
  );
};