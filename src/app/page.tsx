import { redirect } from 'next/navigation'

// Root redirects straight to the Payload admin panel
export default function Home() {
  redirect('/admin')
}
