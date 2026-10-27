import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

import patanImage from "../assets/images/heritage/patan-durbar-square.jpg"
import yomariImage from "../assets/images/food/yomari.jpg"
import indraJatraImage from "../assets/images/festivals/indra-jatra.jpg"
import hakuPatasiImage from "../assets/images/attire/haku-patasi.jpg"

function About() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden px-8 py-20 md:py-28">

        {/* Decorative shapes */}
        <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-green-50" />

        <div className="absolute bottom-0 left-0 h-40 w-40 bg-green-50" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

          {/* Hero text */}
          <div>

            <p className="text-xs font-semibold uppercase tracking-[3px] text-green-700">
              About Culture Nepal
            </p>

            <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-1.5px] text-gray-900 md:text-6xl">
              Preserving Nepal's
              <span className="block text-green-700">
                culture for the future.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-gray-500">
              Culture Nepal is a digital platform created to make Nepal's
              cultural knowledge easier to discover, understand, share, and
              preserve.
            </p>

          </div>


          {/* Hero image */}
          <div className="relative">

            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full border-2 border-green-100" />

            <div className="relative overflow-hidden rounded-[24px]">

              <img
                src={patanImage}
                alt="Patan Durbar Square"
                className="h-[380px] w-full object-cover md:h-[450px]"
              />

            </div>

            <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full bg-green-100/70" />

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* OUR PURPOSE */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#f7f8f5] px-8 py-20 md:py-28">

        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">

          {/* Image */}
          <div className="relative order-2 md:order-1">

            <div className="absolute -left-8 -top-8 h-32 w-32 bg-green-100" />

            <img
              src={yomariImage}
              alt="Traditional Yomari"
              className="relative h-[360px] w-full rounded-[24px] object-cover md:h-[430px]"
            />

            <div className="absolute -bottom-6 right-8 h-20 w-32 rounded-lg bg-green-800" />

          </div>


          {/* Text */}
          <div className="order-1 md:order-2">

            <p className="text-xs font-semibold uppercase tracking-[3px] text-green-700">
              Our purpose
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-1px] text-gray-900 md:text-5xl">
              Making cultural knowledge easier to discover.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-gray-500">
              Important information about Nepal's cultural practices,
              traditional food, attire, festivals, jewelry, and heritage
              sites can often be found across different sources.
            </p>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500">
              Culture Nepal brings these different areas together in one
              organized platform so people can explore cultural knowledge
              in a simple and meaningful way.
            </p>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* OUR APPROACH */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden px-8 py-20 md:py-28">

        {/* Decorative background */}
        <div className="absolute right-0 top-20 h-72 w-40 bg-green-50" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">

          {/* Text */}
          <div>

            <p className="text-xs font-semibold uppercase tracking-[3px] text-green-700">
              Our approach
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-1px] text-gray-900 md:text-5xl">
              One place for many parts of Nepal's culture.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-gray-500">
              The platform organizes cultural information into clear
              categories, helping users explore different aspects of
              Nepal's traditions without having to search through
              scattered sources.
            </p>

            {/* Features */}
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6">

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Heritage Sites
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Explore important historical and cultural places.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Traditional Attire
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Learn about traditional clothing and its significance.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Food & Recipes
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Discover traditional foods and recipes.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Festivals
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Explore festivals, celebrations, and traditions.
                </p>
              </div>

            </div>

          </div>


          {/* Image composition */}
          <div className="relative flex justify-center">

            <div className="absolute -right-5 top-0 h-28 w-28 bg-green-100" />

            <div className="relative w-full max-w-md overflow-hidden rounded-[24px]">

              <img
                src={indraJatraImage}
                alt="Indra Jatra Festival"
                className="h-[430px] w-full object-cover"
              />

            </div>

            <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-gray-100" />

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* WHAT WE BRING TOGETHER */}
      {/* ===================================================== */}

      <section className="bg-[#f7f8f5] px-8 py-20 md:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[3px] text-green-700">
              Explore
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-1px] text-gray-900 md:text-5xl">
              What we bring together.
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              Culture Nepal connects different forms of cultural knowledge
              in one accessible digital space.
            </p>

          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {/* Card 1 */}
            <div className="overflow-hidden rounded-2xl bg-white">

              <img
                src={hakuPatasiImage}
                alt="Haku Patasi"
                className="h-60 w-full object-cover"
              />

              <div className="p-6">

                <p className="text-[10px] font-semibold uppercase tracking-[2px] text-green-700">
                  Traditional Attire
                </p>

                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  Traditional clothing
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Learn about traditional garments and the role they play
                  in cultural occasions and identity.
                </p>

              </div>

            </div>


            {/* Card 2 */}
            <div className="overflow-hidden rounded-2xl bg-white">

              <img
                src={yomariImage}
                alt="Yomari"
                className="h-60 w-full object-cover"
              />

              <div className="p-6">

                <p className="text-[10px] font-semibold uppercase tracking-[2px] text-green-700">
                  Food & Recipes
                </p>

                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  Traditional food
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Discover traditional dishes, recipes, and the stories
                  connected to food traditions.
                </p>

              </div>

            </div>


            {/* Card 3 */}
            <div className="overflow-hidden rounded-2xl bg-white">

              <img
                src={indraJatraImage}
                alt="Indra Jatra"
                className="h-60 w-full object-cover"
              />

              <div className="p-6">

                <p className="text-[10px] font-semibold uppercase tracking-[2px] text-green-700">
                  Festivals
                </p>

                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  Festivals & celebrations
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Explore festivals, rituals, celebrations, and community
                  traditions from Nepal.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* COMMUNITY */}
      {/* ===================================================== */}

      <section className="px-8 py-20 md:py-28">

        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[3px] text-green-700">
              Community
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-1px] text-gray-900 md:text-5xl">
              Culture is preserved when people participate.
            </h2>

          </div>


          <div>

            <p className="text-sm leading-7 text-gray-500">
              Culture Nepal is designed not only as a place to read about
              cultural knowledge, but also as a space where communities can
              share stories, recipes, photographs, experiences, and other
              valuable knowledge.
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              Through community participation, the platform can continue
              growing as a useful digital resource for people interested in
              learning about and experiencing Nepal's diverse traditions.
            </p>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* CTA */}
      {/* ===================================================== */}

      <section className="px-8 pb-20">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-green-900">

          <div className="px-8 py-14 text-center md:px-16 md:py-20">

            <p className="text-xs font-semibold uppercase tracking-[3px] text-green-300">
              Discover more
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Explore the cultural richness of Nepal.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-green-100/70">
              Discover heritage sites, traditional attire, food, jewelry,
              festivals, and cultural events.
            </p>

            <Link
              to="/explore"
              className="mt-7 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-50"
            >
              Explore Culture
              <span className="ml-3">
                →
              </span>
            </Link>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-8 py-8 md:flex-row md:items-center">

          <div>

            <p className="text-sm font-semibold text-green-800">
              Culture Nepal
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Cultural Preservation Platform
            </p>

          </div>

          <div className="flex gap-6 text-xs text-gray-400">

            <Link
              to="/"
              className="transition hover:text-green-700"
            >
              Home
            </Link>

            <Link
              to="/explore"
              className="transition hover:text-green-700"
            >
              Explore
            </Link>

            <Link
              to="/events"
              className="transition hover:text-green-700"
            >
              Events
            </Link>

          </div>

        </div>

        <div className="border-t border-gray-100 py-5">

          <p className="text-center text-[11px] text-gray-400">
            © 2026 Culture Nepal · Cultural Preservation Platform
          </p>

        </div>

      </footer>

    </div>
  )
}

export default About