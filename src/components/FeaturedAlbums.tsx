import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'
import { InfiniteSlider } from '@/motion-primitives/infinite-slider';
import VideoBackground from './VideoBackground';

export default function FeaturedAlbums() {
    return (
        <>
            <div className="h-px bg-white/20"></div>
            <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent relative" data-section="featured-albums">
                <VideoBackground />
                <div className="@container mx-auto max-w-5xl px-6">
                    <div className="text-center">
                        <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Featured Albums</h2>
                        <p className="mt-4">Here are some of the albums that have been featured on the platform.</p>
                    </div>
                    <div className="mt-8 md:mt-16">
                        <InfiniteSlider speedOnHover={-20} gap={24}>
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e02ad24c5e36ddcd1957ad35677'
                                alt='Dean blunt - Black Metal 2'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e02af73f776b92d4614152fb141'
                                alt='Jungle Jack - JUNGLE DES ILLUSIONS VOL 2'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e02ecdb8f824367a53468100faf'
                                alt='Yung Lean - Stardust'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e021624590458126fc8b8c64c2f'
                                alt='Lana Del Rey - Ultraviolence'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e020dcf0f3680cff56fe5ff2288'
                                alt='A$AP Rocky - Tailor Swif'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e02bc1028b7e9cd2b17c770a520'
                                alt='Midnight Miami (feat Konvy) - Nino Paid, Konvy'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e020fc93fe41791c5aa51ae9645'
                                alt='DAYS BEFORE RODEO - Travis Scott'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e02d3e668d0c74720c8c23978e3'
                                alt="You're in My System - TORYONTHEBEAT"
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e0234537499b159b0e6d18e5655'
                                alt="You can't tell me - People Make the World Go Round"
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e020cd942c1a864afa4e92d04f2'
                                alt='ye - Kanye West'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e02a875c3ec944b4f164ab5c350'
                                alt='Slime Season 3 - Young Thug'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                            <img
                                src='https://i.scdn.co/image/ab67616d00001e026376f0d88bbbc8cd051e3401'
                                alt='SWAG - 8ruki'
                                className='aspect-square w-[120px] rounded-[4px]'
                            />
                        </InfiniteSlider>
                    </div>
                </div>
            </section>
            <div className="h-px bg-white/20"></div>
        </>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
        />
        <div
            aria-hidden
            className="bg-radial to-background absolute inset-0 from-transparent to-75%"
        />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)