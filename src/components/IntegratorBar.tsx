'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

const menuItems = [
  {
    id: 1,
    title: 'Governo do Estado',
    url: 'http://www.ba.gov.br/',
  },
  {
    id: 2,
    title: 'Sites do Governo',
    url: 'http://www.ba.gov.br/modules/conteudo/conteudo.php?conteudo=6',
  },
  {
    id: 3,
    title: 'Transparência',
    url: 'http://www.ba.gov.br/modules/conteudo/conteudo.php?conteudo=7',
  },
  {
    id: 4,
    title: 'Ouvidoria Geral',
    url: 'http://www.ouvidoriageral.ba.gov.br/',
  },
  {
    id: 5,
    title: 'Acesso à Informação',
    url: 'http://www.acessoainformacao.ba.gov.br/',
  },
  {
    id: 6,
    title: 'Redes Sociais Governo',
    url: 'http://www.ba.gov.br/modules/conteudo/conteudo.php?conteudo=9',
  },
]

export function IntegratorBar() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.75, stiffness: 300 }}
        className="absolute top-[-23px] mx-auto hidden h-[3rem] w-full laptop:visible desktop:inline-block"
      >
        <ul className="bg-primary z-50 mx-auto flex h-full w-2/3 items-end justify-center gap-4 overflow-hidden rounded-full bg-blue-900 pb-1 text-xs text-white shadow-lg">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link href={`${item.url}`} legacyBehavior>
                <a
                  target={'_blank'}
                  className="hover:underline"
                  rel="noreferrer"
                >
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  )
}
