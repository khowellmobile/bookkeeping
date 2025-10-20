# Rental Bookkeeping Application

## Overview

This is a comprehensive web application designed to simplify rental property management and financial record-keeping. Built with a modern **React** frontend and a robust **Django** REST API backend, it provides a secure, real-time platform for tracking rent, recording transactions, and managing multiple properties efficiently.

## Key Features

The application is equipped with the following core functionalities:

* **Secure Authentication:** User registration and login system, secured using Django REST Framework Simple JWT. *(Note: Email activation is functional but currently requires configuration for external emails)*

* **Multi-Property Management:** Easily manage and track financial data for multiple rental properties within a single dashboard.

* **Rent Tracking & Status:** Record, monitor, and update the payment status of monthly rent for all tenants.

* **Transaction Input:** Dedicated interface for logging income and expenses associated with each property.

* **Financial Reporting:** Generate essential reports for tax preparation and financial analysis.

---

## Tech Stack

This project is divided into two main components: a frontend client built with React and a backend API built with Django.

### Frontend (React)

| Package | Purpose |
| :--- | :--- |
| **`react`**, **`react-dom`** | Core JavaScript library for building the user interface. |
| **`react-router-dom`** | Declarative routing for navigation. |
| **`swr`** | A hook for data fetching, caching, and revalidation. |
| **`vite`** | Fast development server and build tool. |

### Backend (Django REST Framework)

| Package | Purpose |
| :--- | :--- |
| **`Django`**, **`djangorestframework`** | Core web framework and REST API implementation. |
| **`djangorestframework_simplejwt`** | Secure authentication using JSON Web Tokens. |
| **`djoser`** | User registration and authentication |
| **`psycopg2-binary`** | PostgreSQL database adapter. |
| **`django-phonenumber-field`** | Handling and validating international phone numbers. |
| **`django-cors-headers`** | Managing Cross-Origin Resource Sharing for the React client. |

---

## Deployment and Data Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Hosting** | AWS (Amazon Web Services) | The production backend and frontend are hosted on AWS. |
| **Database** | PostgreSQL on Supabase | Utilizes a managed PostgreSQL instance provided by Supabase for reliable, scalable data storage. |

---
