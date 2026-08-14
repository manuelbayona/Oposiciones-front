import { ConvocationPicker } from '../components/ConvocationPicker'
import { DataDisclaimer } from '../components/DataDisclaimer'
import { EvolutionPreview } from '../components/EvolutionPreview'
import { FutureRoadmap } from '../components/FutureRoadmap'
import { Hero } from '../components/Hero'
import { IntroSection } from '../components/IntroSection'
import { ValueProps } from '../components/ValueProps'

export function HomePage() {
  return (
    <div className="flex flex-col divide-y divide-slate-100">
      <Hero />
      <IntroSection />
      <ValueProps />
      <div className="py-10">
        <ConvocationPicker />
      </div>
      <FutureRoadmap />
      <EvolutionPreview />
      <div className="py-10">
        <DataDisclaimer />
      </div>
    </div>
  )
}
