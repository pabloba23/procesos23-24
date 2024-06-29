const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

async function accessClaveCorreo(){ //hay que cambiar el modo de definir las opciones porque ahora tenemos un callback
    const name = 'projects/440901487/secrets/ClaveCorreo/versions/1';
      const [version] = await client.accessSecretVersion({
        name: name,
      });
      //console.info(`Found secret ${version.name} with state ${version.state}`);
      const datos=version.payload.data.toString("utf8");
      //console.log("Datos "+datos);
      //callback(datos);
      return datos;
}

async function accessUserCorreo(){
  const name = 'projects/440901487/secrets/UserCorreo/versions/1';
    const [version] = await client.accessSecretVersion({
      name: name,
    });
    //console.info(`Found secret ${version.name} with state ${version.state}`);
    const datos=version.payload.data.toString("utf8");
    //console.log("Datos "+datos);
    //callback(datos);
    return datos;
} 

module.exports.obtenerOptions=async function(callback){
  let options={user:"", pass:""};
  let pass= await accessClaveCorreo();
  let user = await accessUserCorreo();

  options.user=user;
  options.pass=pass;

  callback(options);
}
