# Admin Panel Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the admin panel to have a modern sidebar layout, enhance the products, categories, and leads sections with search/filters, and implement a drag-and-drop product upload section.

**Architecture:** We will convert `Admin.jsx` from a topbar layout to a responsive sidebar layout. We will update `ProductsPanel.jsx`, `CategoriesPanel.jsx`, and `LeadsPanel.jsx` to include search bars and better table structures. We will enhance the `ProductEditor` in `ProductsPanel.jsx` to use a drag-and-drop zone for image uploads instead of a basic file input.

**Tech Stack:** React, Vanilla CSS.

---

### Task 1: Redesign Admin Layout to Sidebar

**Files:**
- Modify: `client/src/admin/Admin.jsx`
- Modify: `client/src/admin/admin.css`

**Step 1: Write the failing test**
(Skipped for UI, will verify visually)

**Step 2: Write minimal implementation**
Update `admin.css` to change `.admin-shell` to `flex-direction: row` (desktop) and create a `.admin-sidebar` class.
Update `Admin.jsx` to replace `<header className="admin-topbar">` with `<aside className="admin-sidebar">`.

**Step 3: Commit**
```bash
git add client/src/admin/Admin.jsx client/src/admin/admin.css
git commit -m "feat(admin): redesign layout to use a modern sidebar"
```

### Task 2: Enhance Leads, Categories, and Products with Search

**Files:**
- Modify: `client/src/admin/ProductsPanel.jsx`
- Modify: `client/src/admin/LeadsPanel.jsx`
- Modify: `client/src/admin/CategoriesPanel.jsx`

**Step 1: Write minimal implementation**
Add a `<input type="text" placeholder="Search..." />` state (`searchQuery`) to each panel's `.admin-toolbar`. Filter the displayed array (`products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))`).

**Step 2: Commit**
```bash
git add client/src/admin/ProductsPanel.jsx client/src/admin/LeadsPanel.jsx client/src/admin/CategoriesPanel.jsx
git commit -m "feat(admin): add search filtering to all admin panels"
```

### Task 3: Implement Drag-and-Drop Product Upload

**Files:**
- Modify: `client/src/admin/ProductsPanel.jsx`
- Modify: `client/src/admin/admin.css`

**Step 1: Write minimal implementation**
In `admin.css`, add `.drop-zone` styles (dashed border, background change on hover).
In `ProductsPanel.jsx`, update the `ProductEditor` component's image upload field. Add `onDragOver`, `onDragLeave`, and `onDrop` event handlers to the div. When dropped, extract `e.dataTransfer.files[0]` and trigger `handleUpload`.

**Step 2: Commit**
```bash
git add client/src/admin/ProductsPanel.jsx client/src/admin/admin.css
git commit -m "feat(admin): enhance product image upload with drag-and-drop"
```
