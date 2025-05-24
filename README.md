     
# DocuTemplatePro

DocuTemplatePro is a powerful document template management and PDF generation application built with React and Node.js. It allows users to upload document templates with placeholders, fill them with data, and generate professional PDFs.

## Features

- **Template Management**: Upload and manage document templates with predefined placeholders
- **PDF Generation**: Convert templates to PDFs with user-provided data
- **Real-time Preview**: See how your document will look before generating the final PDF
- **Dashboard**: View statistics and recent activity at a glance
- **Responsive Design**: Works on desktop and mobile devices
- **Image Support**: Include images in your generated PDFs

## Technology Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Radix UI components (via shadcn/ui)
- React Query for data fetching
- Wouter for routing

### Backend
- Node.js with Express
- PDFKit for PDF generation
- PostgreSQL database (via Neon)
- Drizzle ORM for database operations

## Project Structure

- `/client`: React frontend application
- `/server`: Node.js backend services
- `/shared`: Shared TypeScript types and database schema
- `/generated-pdfs`: Storage for generated PDF files

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/DocuTemplatePro.git
   cd DocuTemplatePro
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## Usage

1. **Upload a Template**: Navigate to the Templates page and upload a document with placeholders in the format `{placeholderName}`

2. **Generate a PDF**: Select a template, fill in the required fields, and generate your PDF

3. **View Generated PDFs**: Access all your generated PDFs from the Generated PDFs page

## Database Schema

The application uses the following main tables:
- `users`: User authentication and profile information
- `templates`: Document templates with placeholders
- `generatedPdfs`: Records of generated PDF documents

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [PDFKit](https://pdfkit.org/) for PDF generation
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Drizzle ORM](https://orm.drizzle.team/) for database operations
