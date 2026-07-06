import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import styles from './Accordion.module.css'

interface AccordionItem {
  id: number | string
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
}

export default function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<number | string | null>(null)

  const toggle = (id: number | string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <button
            type="button"
            className={`${styles.trigger} ${openId === item.id ? styles.active : ''}`}
            onClick={() => toggle(item.id)}
            aria-expanded={openId === item.id}
          >
            <span className={styles.question}>{item.question}</span>
            <ChevronDown
              size={18}
              className={`${styles.icon} ${openId === item.id ? styles.iconActive : ''}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openId === item.id && (
              <motion.div
                className={styles.content}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className={styles.answer}>{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
