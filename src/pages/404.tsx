export default function NotFound() {
  return null
}

//Redirect if path doesn't exist 
export const getStaticProps = () => {
  return {
    redirect: {
      destination: '/'
    }
  }
}