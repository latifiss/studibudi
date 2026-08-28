'use client'

import React from 'react'
import Hero from '@/components/ui/hero'
import School from '@/components/ui/school'
import Detail from '@/components/ui/detail'
import Compare from '@/components/ui/compare'
import How from '@/components/ui/how'
import Loved from '@/components/ui/loved'
import FAQ from '@/components/ui/faq'
import Footer from '@/components/ui/footer'

const sections = [Hero, School, Detail, Compare, How, Loved, FAQ]

const HomePage = () => {
  return (
    <>
      <main className="flex flex-col items-center w-full pt-3">
        {sections.map((Section, index) => (
          <React.Fragment key={index}>
            <Section />
            {index < sections.length - 1 && (
              <div className="h-5.25 sm:h-19.5 lg:h-32" />
            )}
          </React.Fragment>
        ))}
        <div className="mt-15.75 sm:mt-19.5 lg:mt-32 w-full">
          <Footer />
        </div>
      </main>
    </>
  )
}

export default HomePage