import Image from 'next/image'
import styles from './TechIcon.module.css'
import { techIcons } from '@/lib/techIcons'

interface TechIconProps {
  name: string
  
  size?: 'small' | 'medium' | 'large' 
}

export default function TechIcon({ name, size = 'medium' }: TechIconProps) {
  
  const iconSrc = techIcons[name]

  return (
    <div className={`${styles.wrapper} ${styles[size]}`}>
      {iconSrc ? (
        <Image 
          src={iconSrc} 
          alt={name} 
          width={23} 
          height={18} 
          className={styles.icon} 
        />
      ) : (
        <span className="pixel-badge">{name}</span>
      )}
      <span className={styles.tooltip}>{name}</span>
    </div>
  )
}