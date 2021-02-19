# Non-Credit Card Pledge Codebase

## Description
This repository is going to be used for any automation code necessary to set up the One for the World non-credit card pledge. Currently, there is only one automated script - `ScheduledEmails.js` - which is used in the Google Apps Script alongside the relevant Google Spreadsheet.

### Script Objective
This attached script, `ScheduledEmails.js`, does the following steps _daily_:
1. Iterate through the list of entries.
2. For any entry whose "Expected Credit Card Date" - the date when the new pledge predicts they will have a valid credit card - is past the current day, and for which no email has already been sent, an email is sent to both the pledge and the volunteer. (See the below sections for the email details.)
3. For any entry whose "Expected Credit Card Date" has been updated such that it is _after_ the current day, but an email has already been sent, change the setting to allow another email to be sent.

#### Volunteer Email Example
Subject: [Action Required] Contact Jimmy for OFTW Pledge

> Hey John Doe,
>
> This is an automated email from One for the World letting you know
that Jimmy Day, who pledged on 2/18/2021, may now have a credit
card and be able to take the pledge on Donational.
>
> We recommend that you draft an email to him at undefined, or reach out
to him on some social media platform. Please note they have also
received an automated reminder email which you were cc'd on, but we
still strongly recommend you contact them.
>
> If you have signed the One for the World NDA, you can view the details
they've signed up for at
https://docs.google.com/spreadsheets/d/1DPAydZ1urJdDLhsxxD_t1hVcNXsBc1fEghFRMDmtSEc/edit#gid=1389706953;
if not, you can sign that at [One for the World NDA Link Here], and
contact chriselliott@1fortheworld.org to gain access.
>
> If you cannot view the sheet, some relevant information is here:
> - Selected Donation Portfolio: OFTW Top Picks
> - Selected Donation Level: Standard Pledge: 3%
> - Expected Post-Graduation Salary: $100000
> - Donational Monthly Donation (Calculated): $250
> - Associated Chapter: University of Pennsylvania (UG)
> - Predicted Graduation Year: 2023
>
> If you are no longer part of One for the World, please forward this
email to somebody at the relevant chapter (University of Pennsylvania
(UG)), by looking at the chapter search:
https://www.1fortheworld.org/chapter-search.
>
> Thank you!
>
> One for the World Team

#### Pledge Email Example
Subject: [Action Requested] Take the OFTW Pledge on Donational

> Hey Jimmy,
>
>This is an automated email from One for the World letting you know
that since you took the Standard Pledge: 3% pledge on 2/18/2021, you
indicated that you may have a credit card available to take the
official One for the World pledge at donational.org.
>
> Do you now have a valid credit card, or a manner to take the One for
the World pledge? If so, please sign up at donational.org!
>
> If you do not have this information ready, please update the expected
date that you will be ready for your non-credit card pledge at
https://forms.gle/U8emKCG2Coq8tmvw8.
>
> As a reminder, here are the pledge preferences you have added:
> - Selected Donation Portfolio: OFTW Top Picks
> - Selected Donation Level: Standard Pledge: 3%
> - Expected Post-Graduation Salary: $100000
> - Donational Monthly Donation (Calculated): $250
> - Associated Chapter: University of Pennsylvania (UG)
>
> We have cc'd the volunteer attached to your non-credit card pledge -
John Doe - please contact him with any questions you have about
the pledge. They have also received an automated email alerting them
that you may now be able to take the pledge.
>
> Thank you! We can't wait for you to the pledge, and have an amazing
impact on helping combat extreme poverty - every dollar goes a very
long way. We are sincerely grateful.
>
> One for the World Team

## Related Documents
- **[Non-Credit Card Pledge Form](https://docs.google.com/forms/d/1yXWzXhnWqiGOtQBddDzer7QAsvU5QZpFdoLR5frcxq4/viewform?edit_requested=true)**: Pledges without credit card information can fill out this form as an alternative pledging system.
- **[Non-Credit Card Pledge Spreadsheet](https://docs.google.com/spreadsheets/d/1DPAydZ1urJdDLhsxxD_t1hVcNXsBc1fEghFRMDmtSEc/edit#gid=1389706953)**: Volunteers who are have signed the One for the World NDA and are looking to view these pledges and update Donational pledge information can do so at this spreadsheet.
- **[Non-Credit Card Pledge Google Drive Folder](https://drive.google.com/drive/u/0/folders/1V3J8LltWNjZ3lwJyMqJz4v4bcFWRCvn4)**: Volunteers can access both of the above documents at this folder.

## How to Update
To prevent the automated system from unexpectedly breaking due to poor code changes, I (@zpChris) am envisioning that any script issues can be raised as a GitHub "Issue" here. Any potential code changes can also be made through a pull request, since that functionality of checking code does not seem like it is available on Google Apps Script.

Note: The `ScheduledEmails.js` file has extension `js`, but the Google Apps Script uses file extension `gs`. However, since it seems that the `gs` file acts the same as the `js` file (but includes certain objects like `GmailApp` and `SpreadsheetApp`), so for accessibility I'm including this simply as a `js` file.
