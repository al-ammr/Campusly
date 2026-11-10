export interface CuratedAnnouncement {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  authority: string;
  published_at: string;
  pinned: boolean;
  readTime: string;
  tags: string[];
}

export const CURATED_ANNOUNCEMENTS: CuratedAnnouncement[] = [
  {
    id: 'a1000000-0000-4000-a000-000000000001',
    slug: 'abu-senate-2026-calendar',
    title: 'ABU Senate Approves 2025/2026 Academic Calendar and Resumption Dates',
    category: 'Academic',
    authority: 'Academic Affairs Directorate',
    published_at: '2026-11-04T08:00:00.000Z',
    pinned: true,
    readTime: '2 min read',
    tags: ['Resumption', 'Registration', 'Calendar', 'Samaru', 'Kongo'],
    summary:
      'Official dates for online registration, commencement of lectures, freshers matriculation, and first semester exams across all faculties.',
    body: `The Senate of Ahmadu Bello University has released the official academic calendar for the 2025/2026 academic session for both Samaru and Kongo campuses.

### Resumption Timetable

- **Online Course Registration:** Monday, November 17 – Friday, November 28, 2026.
- **Lectures Begin:** Monday, December 1, 2026.
- **Late Registration Closes:** Friday, December 12, 2026.
- **Freshers Matriculation:** Tuesday, January 13, 2027 at the Convocation Square.
- **Mid-Semester Break:** Monday, February 2 – Saturday, February 7, 2027.
- **First Semester Examinations:** Monday, March 23 – Saturday, April 11, 2027.

### What Students Need to Do

1. Log into the student portal to complete your course registration before attending lecture sign-offs.
2. Hostel booking will open alongside fee payment on a first-come, first-served basis for eligible students.
3. Level coordinators and course advisors will be in their departmental offices daily from 10:00 AM to 2:00 PM to assist students with course verification.

For help with portal issues, visit the Academic Affairs office at Senate Building (Samaru) or the Sub-Registry at Kongo.`,
  },
  {
    id: 'a1000000-0000-4000-a000-000000000002',
    slug: 'gdgoc-hackathon-2026',
    title: 'GDGOC ABU Zaria Campus Hackathon 2026 at Institute for Computing',
    category: 'Tech & Hackathons',
    authority: 'GDGOC ABU Zaria',
    published_at: '2026-11-02T10:30:00.000Z',
    pinned: true,
    readTime: '3 min read',
    tags: ['Hackathon', 'GDGOC', 'Coding', 'Prizes', 'Tech'],
    summary:
      'A 48-hour student hackathon building tech solutions for campus transport, student businesses, and agriculture with cash prizes and cloud credits.',
    body: `Google Developer Groups on Campus (GDGOC) ABU Zaria is hosting its annual 48-hour student hackathon at the Institute for Computing & ICT (ICICT).

Programmers, designers, writers, and curious problem solvers from all faculties and levels are welcome to participate.

### Challenge Categories

1. **Campus Mobility:** Tools to make campus transit and moving between Samaru and Kongo easier and safer.
2. **Student Business Tools:** Easy tools to help student entrepreneurs track sales, receive orders, and build trust.
3. **AgriTech for Northern Nigeria:** Simple offline-friendly apps to help local farmers track market prices and weather updates.

### Event Details

- **When:** Friday, November 28 to Sunday, November 30, 2026.
- **Where:** ICICT Computer Labs, Samaru Main Campus.
- **Teams:** 2 to 4 students per team.
- **What is provided:** High-speed internet, continuous power, meals, drinks, and mentor support.
- **Prizes:** ₦750,000 cash prize pool, Google developer credits, and mentorship opportunities.

Registration is free and open until Friday, November 21, 2026. Apply through the Campusly Opportunities page.`,
  },
  {
    id: 'a1000000-0000-4000-a000-000000000003',
    slug: 'samaru-kongo-transit',
    title: 'Updated Campus Shuttle Bus Times Between Samaru and Kongo',
    category: 'Campus Transit',
    authority: 'Campus Transport Committee',
    published_at: '2026-10-28T09:15:00.000Z',
    pinned: false,
    readTime: '2 min read',
    tags: ['Bus', 'Shuttle', 'Transit', 'Samaru', 'Kongo'],
    summary:
      'New departure times and designated bus stops at Convocation Square and Kongo Old Admin running every 20-25 minutes.',
    body: `The Campus Transport Committee has updated the daily bus schedules for student shuttles running between Samaru and Kongo campuses.

### Daily Schedule (Monday to Friday)

- **Morning Rush (6:45 AM – 9:30 AM):** Buses depart every 20 minutes from both campuses.
- **Mid-Day Service (10:00 AM – 2:00 PM):** Buses depart every 30 minutes.
- **Evening Return (3:30 PM – 7:15 PM):** Buses depart every 25 minutes.
- **Saturdays:** Buses run at 8:30 AM, 12:00 PM, and 4:30 PM.

### Boarding Points

- **Samaru Campus:** Bus bays next to the Convocation Square (opposite Faculty of Education).
- **Kongo Campus:** Old Administration bus stop near the Institute of Administration Library.

### Student Fare

- The subsidized student fare is ₦150 per trip. Please show your student ID card when purchasing your ticket.
- For safety, buses will not take standing passengers. Please queue orderly at the stops.`,
  },
  {
    id: 'a1000000-0000-4000-a000-000000000004',
    slug: 'library-digital-portal',
    title: 'Kashim Ibrahim Library Launches Free Online Research Access for Students',
    category: 'Library',
    authority: 'Kashim Ibrahim Library',
    published_at: '2026-10-22T14:00:00.000Z',
    pinned: false,
    readTime: '2 min read',
    tags: ['Library', 'Research', 'Books', 'Journals'],
    summary:
      'Students can now read thousands of academic journals and research papers from home using their matric number.',
    body: `Kashim Ibrahim Library (KIL) has updated its electronic portal so students can now read research papers, textbooks, and academic journals from off-campus.

You can access major academic databases including ScienceDirect, IEEE Xplore, JSTOR, and African Journals Online without needing to be connected to campus Wi-Fi.

### How to Sign In From Home

1. Visit the library access portal on your phone or computer.
2. Enter your student matriculation number and date of birth.
3. You will be logged in with full access to download papers and book chapters for your assignments and projects.

The main library study halls remain open Monday to Friday from 8:00 AM to 10:00 PM, and on Saturdays from 9:00 AM to 6:00 PM.`,
  },
  {
    id: 'a1000000-0000-4000-a000-000000000005',
    slug: 'student-venture-grant',
    title: 'Applications Open for the 2026 Campusly Student Business Grant',
    category: 'Grants',
    authority: 'Campusly Innovation Fund',
    published_at: '2026-10-18T11:00:00.000Z',
    pinned: false,
    readTime: '3 min read',
    tags: ['Grants', 'Funding', 'Student Business', 'Venture'],
    summary:
      'Grants up to ₦250,000 for student-run businesses across printing, food, tech, repairs, and fashion at ABU Zaria.',
    body: `Are you running a business on campus while studying? Applications are now open for the 2026 Campusly Student Business Grant.

This program provides free grants (no equity, no loans to repay) to help student founders buy equipment, build inventory, and grow their ventures.

### Grant Categories

- **Starter Grant (₦100,000):** For buying basic tools, kitchen supplies, sewing gear, or phone repair toolkits.
- **Growth Grant (₦250,000):** For existing student businesses with steady campus customers and reviews on Campusly.

### Who Can Apply

1. You must be an active student at Ahmadu Bello University (Samaru or Kongo).
2. Your business must be listed on Campusly with verified contact details.
3. Both undergraduate and postgraduate students are eligible.

Apply online on the Campusly Opportunities page before Friday, November 28, 2026.`,
  },
  {
    id: 'a1000000-0000-4000-a000-000000000006',
    slug: 'abu-sports-festival',
    title: 'Inter-Faculty Sports Games Announced for December at Samaru Stadium',
    category: 'Campus Life',
    authority: 'ABU Sports Council',
    published_at: '2026-10-12T16:30:00.000Z',
    pinned: false,
    readTime: '2 min read',
    tags: ['Sports', 'Football', 'Games', 'Samaru'],
    summary:
      'Twelve faculties to compete in football, basketball, track and field, table tennis, and chess at the Samaru Sports Complex.',
    body: `The ABU Sports Council has announced the dates for the 2026 Inter-Faculty Sports Festival.

Students from all twelve faculties will compete for medals across various team and individual sports.

### Schedule of Events

- **Opening Ceremony:** Wednesday, December 10, 2026 at 2:00 PM at Samaru Main Bowl.
- **Football, Basketball & Volleyball Matches:** December 11 to December 15, 2026.
- **Track & Field, Table Tennis & Chess:** December 16 to December 18, 2026.
- **Championship Finals & Awards:** Saturday, December 19, 2026.

Admission is free for all students. Come out to cheer on your faculty teams!`,
  },
];

export function getCuratedAnnouncements(): CuratedAnnouncement[] {
  return CURATED_ANNOUNCEMENTS;
}

export function getCuratedAnnouncementByIdOrSlug(idOrSlug: string): CuratedAnnouncement | null {
  const clean = idOrSlug.trim().toLowerCase();
  return (
    CURATED_ANNOUNCEMENTS.find(
      (a) => a.id.toLowerCase() === clean || a.slug.toLowerCase() === clean
    ) || null
  );
}
