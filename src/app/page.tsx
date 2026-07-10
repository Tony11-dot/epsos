import { getContent } from "@/lib/store";
import SmoothScroll from "@/components/SmoothScroll";
import CursorGlow from "@/components/CursorGlow";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Courses from "@/components/site/Courses";
import News from "@/components/site/News";
import Mentors from "@/components/site/Mentors";
import HonorRoll from "@/components/site/HonorRoll";
import Control from "@/components/site/Control";
import AppShowcase from "@/components/site/AppShowcase";
import Register from "@/components/site/Register";
import RegisterFab from "@/components/site/RegisterFab";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

// Public content is read at request time so admin edits reflect live.
export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getContent();

  return (
    <>
      <SmoothScroll />
      <CursorGlow />
      <Nav brand={c.brand} nav={c.nav} />
      <main>
        <Hero brand={c.brand} hero={c.hero} />
        <About about={c.about} />
        <Courses courses={c.courses} />
        <News news={c.news} />
        <Mentors mentors={c.mentors} />
        <HonorRoll honorRoll={c.honorRoll} />
        <Control control={c.control} />
        <AppShowcase app={c.app} />
        <Register
          registration={c.registration}
          courses={c.courses.items.map((course) => ({ id: course.id, title: course.title }))}
        />
        <Contact contact={c.contact} />
      </main>
      <Footer brand={c.brand} nav={c.nav} footer={c.footer} socials={c.contact.info.socials} />
      <RegisterFab label={c.registration.fabLabel} />
    </>
  );
}
