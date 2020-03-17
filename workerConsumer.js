const amqp = require('amqplib//callback_api') //library untuk amq 
const mqtt = require('mqtt')

var client = mqtt.connect('mqtt://167.205.7.226', {
    username: '/iotpertanian:iot_pertanian',
    password: 'iotpertanian',
    port: 1883
})

amqp.connect({ protocol: 'amqp', hostname: '167.205.7.226', port: '5672', username: 'iot_pertanian', password: 'iotpertanian', vhost: '/iotpertanian' }, (err, conn) => {
    conn.createChannel((err, ch) => {
        const q = 'publish' //Nama queue untuk amq

        ch.assertQueue(q, { durable: true }) //menyatakan queue nya bernama task_queue
        ch.prefetch(1)
        console.log(`[*] Menunggu pesan di %s. untuk keluar tekan CTRL + C`, q)
        //Menangkap pesan yang dikirimkan rabbitmq dari antrian

        ch.consume(q, msg => {

            const secs = msg.content.toString().split('.').length - 1

            console.log(`[x] Menerima %s`, msg.content.toString())
            setTimeout(() => {
                console.log(`[x] Done`)
                ch.ack(msg)
                //publish memakai mqtt
                client.publish('regisweb', msg.content.toString())
            }, secs * 1000)
            //Ack dan noAck untuk mengantisipasi saat koneksi mati queue masih tersimpan dan belum di hapus
        }, { noAck: false })
    })
})