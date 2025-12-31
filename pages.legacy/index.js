import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Skinstric</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1>Skinstric</h1>
      </main>
    </div>
  )
}

