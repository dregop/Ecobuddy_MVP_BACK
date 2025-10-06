import { ingestPdfFile } from '../services/rag/ingestion.service.js'
import path from 'path'
import { fileURLToPath } from 'url'

// ✅ Recrée __dirname manuellement
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function run() {
  // await ingestPdfFile(
  //   path.join(__dirname, '../assets/pdfs/ipcc-ar6.pdf'),
  //   'IPCC AR6',
  //   'https://www.ipcc.ch/report/ar6/syr/'
  // )

  // await ingestPdfFile(
  //   path.join(__dirname, '../assets/pdfs/unep-2024.pdf'),
  //   'UNEP 2024',
  //   'https://www.unep.org/resources/emissions-gap-report-2024'
  // )

  await ingestPdfFile(
    path.join(__dirname, '../assets/pdfs/igas-2024.pdf'),
    'IGAS 2024',
    'https://www.igas.gouv.fr/sites/igas/files/2024-12/Rapport%20Igas%20-%20Les%20enjeux%20sociaux%20du%20changement%20climatique_0.pdf'
  )

  await ingestPdfFile(
    path.join(__dirname, '../assets/pdfs/HCC_RA_2025.pdf'),
    'HCC RA 2025',
    'https://www.hautconseilclimat.fr/publications/rapport-grand-public-2023/'
  )

  await ingestPdfFile(
    path.join(__dirname, '../assets/pdfs/ESOTC-2024.pdf'),
    'ESOTC 2024',
    'https://climate.copernicus.eu/sites/default/files/custom-uploads/ESOTC-2024/press-resources/ESOTC-2024-report.pdf'
  )

  console.log('Ingestion terminée.')
}



run()
