# 🎮 WiggleWorld Landing Page

An interactive exergame landing page for kids, built with Next.js, TypeScript, and Framer Motion. Features a Duolingo-inspired design in dark mode with neon accents, Lottie animations, and a fun parental gate modal.

## ✨ Features

- **🎨 Dark Mode Design**: Beautiful dark theme with neon teal, pink, lime, and lemon accents
- **🎭 Lottie Animations**: Multiple Lottie animations scattered throughout the page
- **🔒 Parental Gate**: Interactive math challenge modal for parental control
- **📱 Responsive**: Fully responsive design that works on all devices
- **🎯 Smooth Animations**: Framer Motion animations with wiggle effects and hover states
- **🎨 Custom Styling**: Tailwind CSS with custom color palette and animations

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Lottie**: @lottiefiles/react-lottie-player
- **Fonts**: Google Fonts (Fredoka, Inter)

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and Tailwind directives
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section with CTA
│   ├── HowItWorks.tsx      # Three-step process explanation
│   ├── Features.tsx        # Feature cards grid
│   ├── Demo.tsx            # Demo video and testimonials
│   ├── FinalCTA.tsx        # Final call-to-action section
│   ├── Footer.tsx          # Footer with links
│   ├── ParentalModal.tsx   # Parental gate modal
│   └── AnimatedBackground.tsx # Floating background elements
├── public/
│   ├── lottie/             # Lottie animation files
│   └── images/             # Static images
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🎨 Design System

### Colors
- **Background**: `#050713` (Deep dark blue)
- **Neon Teal**: `#6ee7ff`
- **Neon Pink**: `#ff6ad5`
- **Lime**: `#7cfa7b`
- **Lemon**: `#ffe66d`

### Typography
- **Headings**: Fredoka (playful, rounded)
- **Body**: Inter (clean, readable)

### Animations
- **Wiggle**: Hover effect on interactive elements
- **Float**: Continuous floating motion for background elements
- **Glow**: Pulsing glow effects on buttons
- **Fade In**: Staggered entrance animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wiggleworld-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎭 Lottie Animations Used

The landing page features various Lottie animations from your `public/lottie/` directory:

- **mascot.json** - Main hero mascot
- **Happy Dog.json** - Used in multiple components
- **Lion Running.json** - How it works section
- **Yay Jump.json** - Success animations
- **crab walk.json** - Features section
- **Meditating Giraffe.json** - Features section
- **Giraffe neck growing.json** - Features section

## 🔧 Customization

### Adding New Colors
Edit `tailwind.config.js` to add new colors to the design system.

### Modifying Animations
Update the `AnimatedBackground.tsx` component to add new floating elements or modify existing animations.

### Changing Lottie Files
Replace Lottie files in the `public/lottie/` directory and update the component imports accordingly.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Key Features Explained

### Parental Gate Modal
- Opens when clicking "Play Now" buttons
- Features 5 progressive math questions
- Includes Lottie animations for feedback
- Prevents access until all questions are answered correctly

### Animated Background
- Floating orbs and particles
- Subtle grid pattern overlay
- Gradient overlays for depth
- Respects `prefers-reduced-motion` for accessibility

### Interactive Elements
- Hover effects with wiggle animations
- Glowing button states
- Smooth transitions and micro-interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push

### Other Platforms
Build the project and deploy the `out` directory to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Credits

- **Design Inspiration**: Duolingo-style playful design
- **Animations**: LottieFiles community
- **Icons**: Emoji and custom graphics
- **Fonts**: Google Fonts

---

**Made with ❤️ for kids who love to learn and wiggle!** 🎮✨

