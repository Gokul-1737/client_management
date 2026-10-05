import Image from 'next/image'
import Link from 'next/link'

interface BrandLogoProps {
  portal?: string
  dark?: boolean
  compact?: boolean
}

export function BrandLogo({ portal, dark = false, compact = false }: BrandLogoProps) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      <Image
        src="/probyzaar-logo.jpeg"
        alt="Probyzaar Technologies logo"
        width={compact ? 34 : 42}
        height={compact ? 34 : 42}
        className="rounded-xl object-cover shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-[1.03]"
        priority
      />
      <span className="min-w-0">
        <span className={`block truncate text-sm font-bold leading-tight tracking-[-0.02em] ${dark ? 'text-white' : 'text-slate-950'}`}>
          Probyzaar Technologies
        </span>
        {portal && (
          <span className={`mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.16em] ${dark ? 'text-slate-300' : 'text-slate-400'}`}>
            {portal}
          </span>
        )}
      </span>
    </Link>
  )
}
