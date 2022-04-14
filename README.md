# Servidor de Chat

A continuación estarán dispuestas las instrucciones para poder configurar el servidor de chat.

## Configuración NGNIX

Entrar al servidor por SSH para las siguientes configuraciones:

1 - Actualizar Ubuntu
```bash
apt update
```

2 - Instalar NGINX
```bash
apt install nginx
```

3 - Configurar NGINX
```bash
unlink /etc/nginx/sites-enabled/default
```

4 - Crear o copiar archivo [proxy.in] en /etc/nginx/sites-available/

5 - Linkear el nuevo archivo [proxy.in]
```bash
ln -s /etc/nginx/sites-available/proxy.in /etc/nginx/sites-enabled/proxy.in
```

6 - Para asegurarnos de que la sintáxis del archivo esté correcto podemos probar con:
```bash
nginx -t
```

7 - Reiniciar Servicio
```bash
service nginx restart
```


## Configuración Node JS

Entrar al servidor por SSH para las siguientes configuraciones:

1 - Movernos a la carpeta html
```bash
cd /var/www/html
```

2 - Descargar Nodesource
```bash
curl sL https://rpm.nodesource.com/setup_17.x -o nodesource_setup.sh
```

3 - Instalar Nodesource
```bash
bash nodesource_setup.sh
```

4 - Instalar Node JS
```bash
apt install nodejs
```

5 - Instalar Build Essential
```bash
apt install build-essential
```

6 - Para instalar el servidor, mover el código del servidor a la carpeta e instalar
```bash
npm install
```

## Configuración PM2

1 - Instalar paquete
```bash
npm install pm2@latest -g
```

2 - Inicializar PM2 (una vez que el repositorio esté instalado)
```bash
pm2 start ecosystem.config.js --env production
```

```bash
pm2 start ecosystem.config.js --env development
```

```bash
pm2 start ecosystem.config.js --env localdev
```