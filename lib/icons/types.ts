import type { IconNameType } from '@/lib/icons/icons'
import type { ClassName } from '@/types'
import type { SVGProps } from 'react'
import { DevIconNameType } from './dev'
import { LogoNameType } from './logos'
export type IconList = Record<IconNameType | LogoNameType, { viewBox: string; symbol: string }>

export type IconName = IconNameType | LogoNameType | DevIconNameType

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  className?: ClassName
  size?: number
  color?: string
  solid?: boolean
}

export interface IconData {
  symbol: string
  set: string
  viewBox?: string
}
