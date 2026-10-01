import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcrypt'

async function main() {
  console.log('Seeding database with personalized data...')

  // 1. Admin User
  const passwordHash = await bcrypt.hash('12345678', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'biswas@gmail.com' },
    update: {},
    create: {
      name: 'Indrasish Biswas',
      email: 'biswas@gmail.com',
      passwordHash,
      role: 'ADMIN',
    },
  })
  console.log('Admin user created:', adminUser.email)

  // 2. Site Settings
  const siteSettings = await prisma.siteSettings.create({
    data: {
      siteName: 'Indrasish Biswas',
      siteTitle: 'Full-Stack Developer | CS Undergrad | Problem Solver',
      siteDescription: 'Personal portfolio and Custom CMS for Indrasish Biswas.',
      heroTitle: 'Building full-stack web applications 🚀',
      heroSubtitle: 'Java | Python | JavaScript Developer 💻\nExploring databases & backend systems 🗄️\nAlways learning, always shipping ✨',
      contactEmail: 'indrasish.biswas2006@gmail.com',
      contactPhone: '',
      location: '',
      copyrightText: '© 2026 Indrasish Biswas. All rights reserved.',
    },
  })
  console.log('Site settings created')

  // 3. About
  const about = await prisma.about.create({
    data: {
      title: 'About Me',
      shortBio: 'I am a Full-Stack Developer & CS Undergrad focusing on modern scalable backend development.',
      longBio: 'I am a passionate software engineer with experience in Java, JavaScript, Python, React, and Node.js. My current focus is mastering PostgreSQL + Prisma ORM + NeonDB. Fun fact: I debug with console.log and I\'m not ashamed.',
    },
  })
  console.log('About section created')

  // 4. Sample Skills
  const skillsData = [
    { name: 'React', slug: 'react', category: 'Frontend', level: 'Advanced', description: 'Component-based UI development' },
    { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'Frontend', level: 'Advanced', description: 'Utility-first styling' },
    { name: 'Node.js', slug: 'nodejs', category: 'Backend', level: 'Advanced', description: 'Server-side JavaScript' },
    { name: 'Express.js', slug: 'express', category: 'Backend', level: 'Advanced', description: 'Web application framework' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Database', level: 'Advanced', description: 'Relational power' },
    { name: 'Prisma ORM', slug: 'prisma', category: 'ORM', level: 'Advanced', description: 'Type-safe ORM' },
    { name: 'NeonDB', slug: 'neondb', category: 'Database', level: 'Intermediate', description: 'Serverless Postgres' },
    { name: 'Java', slug: 'java', category: 'Language', level: 'Advanced', description: 'Object-oriented programming' },
    { name: 'Python', slug: 'python', category: 'Language', level: 'Advanced', description: 'Scripting and backend' }
  ]
  const createdSkills = []
  for (const skill of skillsData) {
    createdSkills.push(
      await prisma.skill.upsert({
        where: { slug: skill.slug },
        update: {},
        create: skill,
      })
    )
  }
  console.log('Sample skills created')

  // 5. Sample Projects
  const project1 = await prisma.project.upsert({
    where: { slug: 'portfolio-cms' },
    update: {},
    create: {
      title: 'Portfolio & Custom CMS',
      slug: 'portfolio-cms',
      shortDescription: 'A custom portfolio and CMS built with React, Node.js, and PostgreSQL.',
      description: 'Built with React, Vite, Redux Toolkit, Tailwind CSS, Express, and Prisma ORM. Features a full custom admin panel, JWT authentication, and media uploads.',
      status: 'ongoing',
      featured: true,
      repoUrl: 'https://github.com/boxbiswas',
      skills: {
        create: [
          { skill: { connect: { slug: 'react' } } },
          { skill: { connect: { slug: 'nodejs' } } },
          { skill: { connect: { slug: 'postgresql' } } },
          { skill: { connect: { slug: 'prisma' } } }
        ]
      }
    },
  })
  console.log('Sample projects created')

  // 6. Sample Experience
  const experience = await prisma.experience.create({
    data: {
      company: 'University',
      role: 'CS Undergrad',
      location: '',
      employmentType: 'Education',
      startDate: new Date('2023-01-01'), // Adjust as necessary
      isCurrent: true,
      description: 'Studying core CS concepts including OOP, DBMS, and Data Structures & Algorithms.',
    },
  })
  console.log('Sample experience created')

  // 7. Sample Services
  const service = await prisma.service.create({
    data: {
      title: 'Full-Stack Development',
      shortDescription: 'End-to-end web application development.',
      description: 'I build fast, responsive, and scalable web applications using React, Node.js, and PostgreSQL.',
    },
  })
  console.log('Sample services created')

  // 8. Sample Social Links
  const socialLinks = [
    { platform: 'GitHub', label: 'GitHub Profile', url: 'https://github.com/boxbiswas', iconKey: 'github' },
    { platform: 'LinkedIn', label: 'LinkedIn Profile', url: 'https://www.linkedin.com/in/indrasish-biswas-114925351', iconKey: 'linkedin' },
    { platform: 'Email', label: 'Email Me', url: 'mailto:indrasish.biswas2006@gmail.com', iconKey: 'mail' }
  ]
  
  for (const link of socialLinks) {
    await prisma.socialLink.create({ data: link })
  }
  console.log('Sample social links created')

  console.log('Database seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
