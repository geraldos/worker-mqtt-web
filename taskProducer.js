const amqp = require('amqplib//callback_api') //library untuk amqp nya

amqp.connect({ protocol: 'amqp', hostname: '167.205.7.226', port: '5672', username: 'iot_pertanian', password: 'iotpertanian', vhost: '/iotpertanian' }, (err, conn) => {
    conn.createChannel((err, ch) => {
        const q = 'ini' //Nama queue yang ada di localhost
        const msg = process.argv.slice(2).join(' ') || '1'

        //durable persistent berfungsi untuk membuat queue dan message yang tersimpan di rabbit mq tidak akan terhapus
        ch.assertQueue(q, { durable: true })
        ch.sendToQueue(q, new Buffer(msg), { persistent: true }) //menambahkan message ke queue
        console.log(`[x] Sent '%s'`, msg)
    })
    //function close, sesudah mengirim pesan
    setTimeout(() => {
        conn.close()
        process.exit(0)
    }, 500)
})