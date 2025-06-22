# DevMastery 🚀

**Your Ultimate Platform for Coding Excellence**

DevMastery is a comprehensive blog and learning platform designed for developers who want to excel in their coding journey. Whether you're preparing for technical interviews, learning new technologies, or building your portfolio, DevMastery provides the tools and resources you need.

## ✨ Features

### 📖 **Content Management**

- **Rich Blog Editor** - Create and publish technical articles with markdown support
- **Notes System** - Organize your learning notes by categories and tags
- **LeetCode Tracker** - Track solved problems with difficulty levels and solutions
- **Code Editor** - Built-in Monaco editor with syntax highlighting and snippet saving

### 🔐 **Authentication & Security**

- **Clerk Integration** - Secure authentication and user management
- **Protected Routes** - Admin dashboard with role-based access
- **File Uploads** - Cloudinary integration for image management

### 🎨 **Modern UI/UX**

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Mode** - Seamless dark/light theme switching
- **Interactive Components** - Rich text editors, syntax highlighting, and more
- **Professional Layout** - Clean, modern interface optimized for readability

### ⚡ **Performance & Technology**

- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Full type safety throughout the application
- **Prisma ORM** - Type-safe database operations with PostgreSQL
- **Nextra** - Documentation-focused site generation

## 🛠️ Tech Stack

**Frontend:**

- Next.js 14
- TypeScript
- Tailwind CSS
- React Hook Form
- Lucide Icons

**Backend:**

- Prisma ORM
- PostgreSQL (Supabase)
- Clerk Authentication
- Cloudinary

**Development:**

- ESLint & Prettier
- Hot Reload
- TypeScript Strict Mode

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account
- Cloudinary account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/devmastery/devmastery-platform.git
   cd devmastery-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   DATABASE_URL=your_database_url
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
devmastery/
├── components/          # Reusable UI components
│   └── admin/          # Admin dashboard components
├── pages/              # Next.js pages and API routes
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API endpoints
│   └── ...             # Static content pages
├── lib/                # Utility functions and configurations
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── styles/             # Global styles
```

## 🎯 Admin Dashboard

Access the admin dashboard at `/admin` to:

- Create and manage blog posts
- Organize study notes
- Track LeetCode problems
- Use the built-in code editor
- Upload and manage media files

## 🔧 Customization

DevMastery is built with customization in mind:

- **Themes**: Modify `theme.config.jsx` for branding
- **Styling**: Update Tailwind configuration
- **Content**: Add new pages in the `pages/` directory
- **Components**: Extend functionality with custom components

## 📱 Mobile Optimization

The platform is fully responsive and optimized for:

- 📱 Mobile devices
- 📄 Tablets
- 🖥️ Desktop computers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Features Coming Soon

- [ ] Real-time collaboration
- [ ] Code execution sandbox
- [ ] Interview practice mode
- [ ] Advanced analytics
- [ ] Multi-language support

---

**Built with ❤️ by the DevMastery Team**

For questions and support, reach out to us at hello@devmastery.deveployed URL: [Click here](https://algocodedex.vercel.app/)
