import '../css/Home.css';
import Navbar from '../components/Navbar';
import Marcas_servicio from './Marcas_servicio';
import Personal_servicio from './Personal_servicio';


function Home() {
  
  return (
    <div>
      <Navbar />
      <Marcas_servicio />
      <Personal_servicio />
    </div>
  );
}
  
export default Home;