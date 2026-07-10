# Backend Completion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the backend by adding file upload support (via Multer/Cloudinary) to leads and setting up email notifications for new quotes.

**Architecture:** We will add a Multer middleware to the POST `/api/leads` route to accept design file uploads, stream them to Cloudinary, and save the URL in the Lead model. Then we will add Nodemailer to send a notification email to the admin.

**Tech Stack:** Express, Mongoose, Multer, Cloudinary, Nodemailer.

---

### Task 1: Update Lead Model for Attachments

**Files:**
- Modify: `server/models/Lead.js:15-16`
- Test: `server/tests/models/Lead.test.js`

**Step 1: Write the failing test**

```javascript
// server/tests/models/Lead.test.js
import Lead from '../../models/Lead.js';
import mongoose from 'mongoose';
import { expect } from 'chai';

describe('Lead Model', () => {
  it('should accept an attachmentUrl string', () => {
    const lead = new Lead({ name: 'Test', phone: '1234567890', attachmentUrl: 'https://res.cloudinary.com/test.pdf' });
    expect(lead.attachmentUrl).to.equal('https://res.cloudinary.com/test.pdf');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test tests/models/Lead.test.js`
Expected: FAIL (attachmentUrl is undefined)

**Step 3: Write minimal implementation**

```javascript
// server/models/Lead.js
// Add this field to the schema:
attachmentUrl: { type: String, default: '', maxlength: 500 },
```

**Step 4: Run test to verify it passes**

Run: `npm run test tests/models/Lead.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add server/models/Lead.js server/tests/models/Lead.test.js
git commit -m "feat: add attachmentUrl to Lead model"
```

### Task 2: Install Nodemailer and Setup Mail Service

**Files:**
- Create: `server/services/mailService.js`
- Test: `server/tests/services/mailService.test.js`

**Step 1: Install dependency**

Run: `npm install nodemailer`

**Step 2: Write the failing test**

```javascript
// server/tests/services/mailService.test.js
import { sendAdminNotification } from '../../services/mailService.js';
import { expect } from 'chai';

describe('Mail Service', () => {
  it('should export sendAdminNotification function', () => {
    expect(typeof sendAdminNotification).to.equal('function');
  });
});
```

**Step 3: Run test to verify it fails**

Run: `npm run test tests/services/mailService.test.js`
Expected: FAIL

**Step 4: Write minimal implementation**

```javascript
// server/services/mailService.js
import nodemailer from 'nodemailer';

export const sendAdminNotification = async (lead) => {
  // basic stub for now
  return true;
};
```

**Step 5: Run test and Commit**

Run: `npm run test tests/services/mailService.test.js`
Expected: PASS

```bash
git add package.json package-lock.json server/services/mailService.js server/tests/services/mailService.test.js
git commit -m "feat: setup basic mail service with nodemailer"
```

### Task 3: Integrate Multer, Cloudinary, and Mailer into Leads Route

**Files:**
- Modify: `server/routes/leads.js:8-48`

**Step 1: Write the failing test**

```javascript
// server/tests/routes/leads.test.js
// (Assuming supertest is setup)
it('should accept multipart/form-data with file and send email', async () => {
  // mock cloudinary and mailer
  // send post request with .attach('file', buffer)
  // expect 201 Created and attachmentUrl populated
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test tests/routes/leads.test.js`
Expected: FAIL

**Step 3: Write minimal implementation**

```javascript
// Add multer and cloudinary imports in server/routes/leads.js
// Use upload.single('file') middleware
// Save file to cloudinary, pass URL to Lead.create()
// Call sendAdminNotification(lead)
```

**Step 4: Run test to verify it passes**

Run: `npm run test tests/routes/leads.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add server/routes/leads.js
git commit -m "feat: handle file uploads and email notifications for quotes"
```
