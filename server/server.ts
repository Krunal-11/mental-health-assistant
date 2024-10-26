import express , {Application} from 'express';
import routes from './routes.ts';

const app:Application = express();

app.use(express.json())
app.use('/api/admin/', routes);

app.listen(8080,()=>{
    console.log('app live at http://localhost:8080/');
})