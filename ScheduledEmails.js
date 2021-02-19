// Cosntant for the link to the relevant Google Sheets and Google Forms.
const SHEETS_LINK = 'https://docs.google.com/spreadsheets/d/1DPAydZ1urJdDLhsxxD_t1hVcNXsBc1fEghFRMDmtSEc/edit#gid=1389706953';
const FORMS_LINK = 'https://forms.gle/U8emKCG2Coq8tmvw8';

// The alias of the person sending the email.
const SENDER_NAME = 'Chris from OFTW';

// Constant for the name of the sheet connected to Google Forms.
const FORM_RESPONSES = 'Form Responses';

// Constant written to "Form Responses" column 18 if form is sent.
const EMAIL_SENT = 'EMAIL_SENT';

// Timestamp identifier for when the non-credit card pledge was taken.
const TIMESTAMP = 'Timestamp';

// First and last name, and email, identifiers of the pledge.
const FIRST_NAME = 'First name';
const LAST_NAME = 'Last name';
const EMAIL = 'Email address';

// Donation portfolio identifier.
const DONATION_PORTFOLIO = 'Donation Portfolio';

// Donation type identifier.
const DONATION_TYPE = 'Your Donation';

// Map from the donation type to the decimal percentage of annual salary.
const DONATION_TYPE_PERCENT = {
  'One for the World Pledge: 1%': 0.01,
  'Standard Pledge: 3%': 0.03,
  'Giving What We Can Pledge: 10%': 0.1
};

// Expected post-graduation salary identifier.
const EXPECTED_SALARY = 'Expected Post-Graduation Salary';

// Associated chapter identifier.
const ASSOCIATED_CHAPTER = 'Associated Chapter';

// Graduation year identifer.
const GRADUATION_YEAR = 'If you are still studying, in what year will you graduate?';

// Name and email identifiers of the volunteer associated with this pledge.
const VOLUNTEER_NAME = 'Volunteer Name';
const VOLUNTEER_EMAIL = 'Volunteer Email';

// Expected credit card date identifier.
const EXPECTED_CARD_DATE = 'When does the new pledge predict they will have a valid credit (or debit) card?';

// Check of whether the volunteer was already emailed identifier.
const IS_EMAILED = 'Emailed (Non-Form)';

/**
 * Sends emails to the volunteer indicating that the pledge may now have
 * a valid credit card, and can sign up using Donational.
 * 
 * An email is sent only if the expected date parameter has been reached or passed,
 * and no prior email has been sent.
 */
function scheduleSendEmails() {
  // Get the sheet Form Responses and its columns.
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FORM_RESPONSES);
  const numColumns = sheet.getLastColumn();
  const columnNames = sheet.getRange(1, 1, 1, numColumns).getValues()[0];

  // Get the number of pledge entries present (one less for the first title row).
  const numEntries = sheet.getLastRow() - 1;

  // For each entry, send an email the date has been passed and none has sent yet.
  for (var i = 2; i <= numEntries + 1; i++) {
    const entryValues = sheet.getRange(i, 1, 1, numColumns).getValues()[0];

    // Match the entry with the column names, for improved readability.
    var entry = {};
    columnNames.forEach((key, i) => entry[key] = entryValues[i]);

    // Check whether the expected date has passed, or if the volunteer was emailed.
    var isDatePassed = new Date() >= entry[EXPECTED_CARD_DATE];
    var isEmailed = entry[IS_EMAILED] != '';

    // If the date has passed and the volunteer not emailed, send the email.
    if (isDatePassed && !isEmailed) {
      // Print to console each entry to which an email is sent.
      console.log(entry);

      // Construct and send emails to the volunteer, and the pledge (with volunteer cc'd).
      sendVolunteerEmail(entry);
      sendPledgeEmail(entry);

      // Mark the IS_EMAILED column as true.
      const isEmailedColumn = columnNames.indexOf(IS_EMAILED) + 1;
      sheet.getRange(i, isEmailedColumn).setValue(EMAIL_SENT);

      // Make sure the cell is updated right away in case the script is interrupted.
      SpreadsheetApp.flush();
    }

    /**
     * If the date has not been passed but the email was sent, that means that the pledge
     * has updated the expected date they will be able to receive their credit card, and the
     * IS_EMAILED column should be reset.
     */
    if (!isDatePassed && isEmailed) {
      // Mark the IS_EMAILED column as false (empty value).
      const isEmailedColumn = columnNames.indexOf(IS_EMAILED) + 1;
      sheet.getRange(i, isEmailedColumn).setValue('');

      // Make sure the cell is updated right away in case the script is interrupted.
      SpreadsheetApp.flush();
    }
  }
}

// Construct and send the email to the volunteer based on entry data.
function sendVolunteerEmail(entry) {
  const email = entry[VOLUNTEER_EMAIL];
  const subject = `[Action Required] Contact ${entry[FIRST_NAME]} for OFTW Pledge`;
  const timestamp = entry[TIMESTAMP];
  const datePledgedStr = `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()}`;
  const monthlyDonationStr = DONATION_TYPE_PERCENT[entry[DONATION_TYPE]] ? `$${Math.round(DONATION_TYPE_PERCENT[entry[DONATION_TYPE]] * entry[EXPECTED_SALARY] / 12)}` : `$${Math.round(entry[EXPECTED_SALARY] / 12)} * X% (from above)`;
  const bodyList = [
    `Hey ${entry[VOLUNTEER_NAME]},`,
    '',
    `This is an automated email from One for the World letting you know that ${entry[FIRST_NAME]} ${entry[LAST_NAME]}, who pledged on ${datePledgedStr}, may now have a credit card and be able to take the pledge on Donational.`,
    '',
    `We recommend that you draft an email to him at ${entry[EMAIL]}, or reach out to him on some social media platform. Please note they have also received an automated reminder email which you were cc'd on, but we still strongly recommend you contact them.`,
    '',
    `If you have signed the One for the World NDA, you can view the details they\'ve signed up for at ${SHEETS_LINK}; if not, you can sign that at https://app.hellosign.com/s/6ge7mnCp, and contact chriselliott@1fortheworld.org to gain access.`,
    '',
    `If you cannot view the sheet, some relevant information is here:`,
    `- Selected Donation Portfolio: ${entry[DONATION_PORTFOLIO]}`,
    `- Selected Donation Level: ${entry[DONATION_TYPE]}`,
    `- Expected Post-Graduation Salary: $${entry[EXPECTED_SALARY]}`,
    `- Donational Monthly Donation (Calculated): ${monthlyDonationStr}`,
    `- Associated Chapter: ${entry[ASSOCIATED_CHAPTER]}`,
    `- Predicted Graduation Year: ${(entry[GRADUATION_YEAR]) ? entry[GRADUATION_YEAR] : 'Already graduated'}`,
    '',
    `If you are no longer part of One for the World, please forward this email to somebody at the relevant chapter (${entry[ASSOCIATED_CHAPTER]}), by looking at the chapter search: https://www.1fortheworld.org/chapter-search.`,
    '',
    'Thank you!',
    '',
    'One for the World Team'
  ];
  const body = bodyList.join('\n');

  // Send an email with the above information.
  GmailApp.sendEmail(email, subject, body, {
    name: SENDER_NAME
  });
}

// Construct and send the email to the pledge (volunteer cc'd) based on entry data.
function sendPledgeEmail(entry) {
  const pledgeEmail = entry[EMAIL];
  const subject = `[Action Requested] Take the OFTW Pledge on Donational`;
  const timestamp = entry[TIMESTAMP];
  const datePledgedStr = `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()}`;
  const monthlyDonationStr = DONATION_TYPE_PERCENT[entry[DONATION_TYPE]] ? `$${Math.round(DONATION_TYPE_PERCENT[entry[DONATION_TYPE]] * entry[EXPECTED_SALARY] / 12)}` : `$${Math.round(entry[EXPECTED_SALARY] / 12)} * X% (from above)`;
  const bodyList = [
    `Hey ${entry[FIRST_NAME]},`,
    '',
    `This is an automated email from One for the World letting you know that since you took the ${entry[DONATION_TYPE]} pledge on ${datePledgedStr}, you indicated that you may have a credit card available to take the official One for the World pledge at donational.org.`,
    '',
    `Do you now have a valid credit card, or a manner to take the One for the World pledge? If so, please sign up at donational.org!`,
    '',
    `If you do not have this information ready, please update the expected date that you will be ready for your non-credit card pledge at ${FORMS_LINK}.`,
    '',
    'As a reminder, here are the pledge preferences you have added:',
    `- Selected Donation Portfolio: ${entry[DONATION_PORTFOLIO]}`,
    `- Selected Donation Level: ${entry[DONATION_TYPE]}`,
    `- Expected Post-Graduation Salary: $${entry[EXPECTED_SALARY]}`,
    `- Donational Monthly Donation (Calculated): ${monthlyDonationStr}`,
    `- Associated Chapter: ${entry[ASSOCIATED_CHAPTER]}`,
    '',
    `We have cc'd the volunteer attached to your non-credit card pledge - ${entry[VOLUNTEER_NAME]} - please contact him with any questions you have about the pledge. They have also received an automated email alerting them that you may now be able to take the pledge.`,
    '',
    'Thank you! We can\'t wait for you to the pledge, and have an amazing impact on helping combat extreme poverty - every dollar goes a very long way. We are sincerely grateful.',
    '',
    'Best,',
    '',
    'One for the World Team'
  ];
  const body = bodyList.join('\n');

  // Send an email with a file from Google Drive attached as a PDF.
  GmailApp.sendEmail(pledgeEmail, subject, body, {
      cc: entry[VOLUNTEER_EMAIL],
      name: SENDER_NAME
  });
}
