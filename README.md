# Node.js Rest APIs with Express & MySQL

### Project setup
```
npm install
```

### Run
```
nodemon index.js
```

### To create/update models and associations, run this command
```
sequelize-auto -h localhost -d skeleton -u brightlab -x brightlab -p 3307 --dialect mysql -o "./src/models" -l es6 --cm p -a "./src/config/.sequelize-auto.cfg.json"-T SequelizeMeta
```