const router = require("express").Router(),
	User = require("../../db").models.users,
	Transaction = require("../../db").models.transactions,
	seq = require("../../db"),
	Session = require("../../db").models.login_sessions,
	Booking = require("../../db").models.bookings,
	UserRequest = require("../../db").models.requests,
	Payment = require("../../db").models.payment_histories,
	Coupan = require("../../db").models.coupans,
	Notification = require("../../db").models.notifications,
	jwt = require("jsonwebtoken"),
	Op = require("sequelize").Op,
	config = require("../../common/config"),
	notify = require("../../common/notify"),
	moment = require("moment"),
	Sequelize = require("sequelize"),
	Rating = require("../../db").models.ratings;
var	Message = require("../../db").models.messages;
var Referal = require("../../db").models.referals;
var Conversations = require("../../db").models.conversations;
const { trim } = require("lodash");
// sleep = require("sleep");
var paypal = require('paypal-rest-sdk');

// configure paypal with the credentials you got when you created your paypal app

//Live gurmeet esfera
// paypal.configure({
// 	'mode': 'live', 
// 	'client_id': 'Ad7kY_B8cUXvUjOy54FkE7L-1HGsceHFIyM8vffbQosyz7MUgUvsMoRDlyXSehbk5tzWmkebVfEo-ERb', // please provide your client id here 
// 	'client_secret': 'EGbSL2tiPQngmr2z3ZoexkwufydFSFe5XRMRnSqUAl5og2ZlHTshnKZGVpv9plAr4egOc9BXRmjp4I7W' // provide your client secret here 
// });

//Sandbox shobhit
// paypal.configure({
// 	'mode': 'sandbox', 
// 	'client_id': 'AYQhyc7idjPY5ajA6dyj7fwi7ZVMqDDNww379kdqyLdQROrEeFNnM4tnirT6IMHULTOnSe0NNYfx2OkH', // please provide your client id here 
// 	'client_secret': 'EM4-i8-bcFZbDhRz96y_1OZvmy0nNea-aq_cnhhScCGjyWKTilH0qTyjKiaYOhaQuamSbCos8aNNnVue' // provide your client secret here 
// });

//Live company account
// paypal.configure({
// 	'mode': 'live', 
// 	'client_id': 'AY3TOivI2H8HRNIDwh0lKhwn-UST2HIzrv51fPHC7cPWL68BW318Ol-bkgQDlnIoukghdZGEPCwQMk01', // please provide your client id here 
// 	'client_secret': 'ELaBTVI_vFNA4ihcjdhk2KwdV3ZiOjgYdNJRkJuOKry4jJ_H8S8fUfWYeRu0TyWG_QFIEIUvs8EhSyLB' // provide your client secret here 
// });

//Live client
paypal.configure({
	'mode': 'live', 
	'client_id': 'AXzWWH3vBmxWDQ9qC0wIOeT2IR4U4Y_j3TPPbr9zBvS7Ca_IarxPmkMHlu34MotQO3m2XXwgwG28pKE9', // please provide your client id here 
	'client_secret': 'EOl-LZM8-UpC8iBbImoEYIYu74EXuZ4pFBsdA4oI8t_LSYpdx4RQ9DjmQ4ikYtlIKvjE3bKtK7gSpRAt' // provide your client secret here 
});

// Sandbox
// paypal.configure({
// 	'mode': 'sandbox', 
// 	'client_id': 'AarXR2Z4eYCGeSQ4G_T6jXQ7-A6s0qYrkA7nRG-szXqkEn5oQxDvoqpRj4LPn0nKSziVdomUO-fFTpk_', // please provide your client id here 
// 	'client_secret': 'EMIyuieaT1luz7fsuWQwxn56FdcUgQrSlDe5uoh9sFlRMp_Gapf2dS1rjR1hNHNuUxf-KlhDNoYLxFCH' // provide your client secret here 
// });

// helper functions
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) { 
             reject(err);  
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}						
	
router.post("/book", async (req, res) => {
	try {
		
		var booking_dataa = await Booking.findOne({
			where: {
				userId: req.body.userId
				// status:"confirmed"
			},
			order: [["id", "DESC"]]
		});

		// res.json('sd');
		// res.json(booking_dataa);
		// const ref = await Referal.findOne();
		// if (ref.discount) {
		// req.body.discount_amount = ref.discount;
		// }

		const { lang } = req.body;
		if (!req.body.modelName) {
			if (lang === "es") {
				var message = "Falta campo del nombre de modelo para agendar";
			} else {
				var message = "Missing modelName fields for booking";
			}
			return res.json({
				status: false,
				message
			});
		}
		if (!req.body.repair_estimate) {
			if (lang === "es") {
				var message =
					"Faltan campos de estimación de reparación para reservar";
			} else {
				var message = "Missing repair estimate fields for booking";
			}
			return res.json({
				status: false,
				message
			});
		}
		if (!req.body.lat && !req.body.lng) {
			if (lang === "es") {
				var message = "Faltan campos lat, lng para reservar";
			} else {
				var message = "Missing lat,lng fields for booking";
			}
			return res.json({
				status: false,
				message
			});
		}

		if (!req.body.address) {
			if (lang === "es") {
				var message = "Faltan campos de dirección para reservar";
			} else {
				var message = "Missing address fields for booking";
			}
			return res.json({
				status: false,
				message
			});
		}

		if (!req.body.dateTime) {
			if (lang === "es") {
				var message = "Fecha faltante Campos de tiempo para reservar";
			} else {
				var message = "Missing dateTime fields for booking";
			}
			return res.json({
				status: false,
				message
			});
		}else{

		}

		if (!req.body.userId) {
			if (lang === "es") {
				var message = "Faltan campos de ID de cliente para reservar";
			} else {
				var message = "Missing userId fields for booking";
			}
			return res.json({
				status: false,
				message
			});
		}
		if (!req.body.modelId) {
			if (lang === "es") {
				var message = "Faltan campos de Id. De modelo para reservar";
			} else {
				var message = "Missing modelId fields for booking";
			}
			return res.json({
				status: false,
				message
			});
		}
		if (req.body.extra_payment) {
			req.body.extra_payment_status = true;
		}

		req.body.status = "pending";
		req.body.tech_seen_unseen = true;
		req.body.user_seen_unseen = false;
		// res.json(req.body);
		// res.json(req.body);
		const booking = new Booking(req.body);
		const temp = await booking.save();

		var bookId = booking.id;
		let limit = 20;
		const lat = booking.lat;
		const lng = booking.lng;
		var i = 0;

		const distance = `( 3959 * acos ( cos ( radians(${lat}) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(${lng}) ) + sin ( radians(${lat}) ) * sin( radians( lat ) ) ) )`;
		query = `SELECT id,lat, lng, ${distance} AS distance FROM technicians where isActive='1' HAVING distance < 10 ORDER BY distance limit ${limit}`;
	 
		const result = seq.query(query, {
			type: seq.QueryTypes.SELECT
		}).then(async tech_location => {

			//console.log(tech_location);
			
			if(tech_location.length < 1){
				if (lang === "es") {
					var message = "Técnicos no disponibles en tu área.";
				} else {
					var message = "Technician Not Found";
				}
				res.json({status:false,message});
			}else{
				await searchTech(booking.id, booking, lang,req,res);
				if (lang === "es") {
					var message = "Reservada con éxito";
				} else {
					var message = "Successfully Booked";
				}
				res.json({
					status: true,
					message
				});
			}
		});
		
	} catch (e) {
		res.json({
			status: "500",
			error: e,
			message: "Internal server errors"
		});
	}
});

async function searchTech(id, booking, lang,req,res) {
	var bookId = id;

	let limit = 20;

	const lat = booking.lat;
	const lng = booking.lng;
	var i = 0;
	const distance = `( 3959 * acos ( cos ( radians(${lat}) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(${lng}) ) + sin ( radians(${lat}) ) * sin( radians( lat ) ) ) )`;
	query = `SELECT id,lat, lng, ${distance} AS distance FROM technicians where isActive='1' HAVING distance < 10 ORDER BY distance limit ${limit}`;
	// return query;
	// res.json('done');
	// var res = await seq.query(query, {
	// 		type: seq.QueryTypes.SELECT
	// });

	// res.json(res);
	const result = seq.query(query, {
			type: seq.QueryTypes.SELECT
		}).then(async tech_location => {

			// res.json(tech_location);
			// return;

			// if(tech_location!=""){
			// 	res.json({status:false,message:"Technician Not Found"});
			// }
			let requests = tech_location.reduce((promiseChain, item) => {

				return promiseChain.then(() =>
						new Promise(async resolve => {
							

							await Booking.update(
								{
									technicianId: item.id
								},

								{
									where: {
										id: id
									}
								}
							);

							const user_request = new UserRequest({
								technician_Status: "pending",
								user_Status: "pending",
								technicianId: item.id,
								bookingId: id
							});
							await user_request.save();

							const tokens = await Session.findOne({
								where: {
									technicianId: item.id,
									isActive: true
								},
								attributes: ["fcm_token",'language']
							});

					
							// console.log(item);
							console.log("s=>"+tokens);
							var tech_id = item.id;
							if(tokens.language  ==='es')
							{
							  var noti_title = "Reserva de cliente";

							}else{

							  var noti_title = "User Booking";

							}
							if(tokens)
							{
								if(tokens.language ==='es')
								{
									var not_message = "Tienes una nueva solicitud de servicio";
								}else{
									var not_message = "You have a new booking request";
								}

								var noti = new Notification({
                                    title: noti_title,
                                    notification_type: "book_tech",
                                    message: not_message,
                                    data: id,
                                    user_to: item.id,
                                    user_from: booking.userId
                                });
								var d = await noti.save();
								// return d;
								// res.json(d);

								await notify.notify(
                                    tokens.fcm_token,
                                    {
                                        message: not_message,
                                        bookingId: id,
                                        technicaianId: item.id,
                                        // technicianId: item.id,
                                        type: "book_tech"
                                    },
                                    1
                                );
						

							}

							await asyncFunction(id, item.id, resolve);
						})
				);
			}, Promise.resolve());

				requests.then(() => console.log("done"));
			// }
		});
}

async function asyncFunction(id, techId, cb) {
	var counter = 100;
	var subcounter = 600;

	let time = setInterval(async e => {
		var checkreq = await UserRequest.findAll({
			where: { bookingId: id, technicianId: techId }
		});

		var status = checkreq[0].technician_Status;
		
		if (status === "pending" && counter === 0) {
			await UserRequest.destroy({
				where: {
					bookingId: id,
					technicianId: techId
				}
			});

			await Booking.update(
				{
					status: "pending",
					technicianId: null
				},
				{ where: { id: id } }
			);

			cb();
			clearInterval(time);
		} else if (status === "rejected") {
			cb();
			clearInterval(time);
		} else if (status === "accept") {
			clearInterval(time);
		} else if (status === "confirmed") {
			clearInterval(time);
		} else if (status === "accepted") {
			clearInterval(time);
		} else if (status === "reviewing" && subcounter != 0) {
			subcounter = subcounter - 1;
			counter = 30;
		} else if (status === "reviewing" && subcounter === 0) {
			counter = 30;
			await UserRequest.destroy({
				where: {
					bookingId: id,
					technicianId: techId
				}
			});
			await Booking.update(
				{
					status: "pending",
					technicianId: null
				},
				{ where: { id: id } }
			);

			cb();
			clearInterval(time);
		}
		counter = counter - 1;
	}, 8000);
}

router.post("/payment", async(req, res) => {
	try{
		const { user_id } = req.body;
		const { amount } = req.body;
		const { booking_id } = req.body;
		const { currency_code } = req.body;

		const pay = await Payment.create({ 
			amount: amount ,
			userId: user_id,
			status: "success",
			bookingId: booking_id,
			currency_code: currency_code
		});
	
		// create payment object 
		var payment = await { 
            "intent": "sale",
			"payer": {
				"payment_method": "paypal"
			},
		"redirect_urls": {
			"return_url": "http://52.201.54.3:3010/mobile/api/booking/payment/success?tid="+pay.id+"&create_time="+encodeURI(pay.createdAt),
			"cancel_url": "http://52.201.54.3:3010/mobile/api/booking/payment/error?tid="+pay.id+"&create_time="+encodeURI(pay.createdAt)
		},
		"transactions": [{
			"item_list": {
				"items": [{
					"name": "item",
					"sku": "item",
					"price": amount,
					"currency": currency_code,
					"quantity": 1
				}]
			},
			"amount": {
				"total": amount,
				"currency": currency_code
			},
			"description": "booking payment"
		}]
	}
		
	
	// call the create Pay method 
    createPay( payment ) 
        .then( ( transaction ) => {
            var id = transaction.id; 
            var links = transaction.links;
            var counter = links.length; 
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction
					res.json({
						status: "200",
						redirectURL: links[counter].href
					}); 
                }
            }
        })
        .catch( ( err ) => { 
            res.json({
				status: "500",
				error: err,
				message: "Internal server errors"
			});
        });

	}catch (e) {
		res.json({
			status: "500",
			error: e,
			message: "Internal server errors"
		});
	}
})

router.get('/payment/success', async(req, res)=>{
	const { tid, create_time, paymentId, token, PayerID } = req.query;
	
	const pay = await Payment.findOne({
			where:{
				id:tid
			}
		});
		
	await pay.update({
		paymentId,
		token,
		PayerID
	});
	
	const data = [{
		transaction_id: tid,
		create_time: create_time
	}]
  
	const execute_payment_json = {
	  "payer_id": PayerID,
	  "transactions": [{
		  "amount": {
			  "currency": pay.currency_code,
			  "total": pay.amount
		  }
	  }]
	};
  
  // Obtains the transaction details from paypal
	paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
		//When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
	  if (error) {
		  console.log(error.response);
		  throw error;
	  } else {
		  console.log(JSON.stringify(payment));
		  res.json({
			status:200,
			message: "Payment done successfully",
			data
		})
	  }
  });
  
	// res.json({
	// 	status:200,
	// 	message: "Payment done successfully",
	// 	data
	// })
})

router.get('/payment/error', async(req, res)=>{
	const { transaction_id } = req.query;
	const { create_time } = req.query;
	
	const data = [{
		transaction_id: transaction_id,
		create_time: create_time
	}]

	res.json({
		status:500,
		message: "Payment was not completed. There was an error",
		data
	})
})

//Validate zip code
router.post("/check-code", async (req, res) => {
	try{

		const { lang } = req.body;
		
		const { zip } = req.body;

		// let zipLength = zip.length;

		// if (zipLength > 5){
		// 	return res.json({
		// 		status: false,
		// 		message: "Zip Code must be equal to 5 characters"
		// 	});
		// }

		const pin = await Pincode.findOne({
			attributes: ['code'],
			where:{
				code: zip
			}
		});

		if (pin === null){
			if (lang === "es") {
				var message = "Lo sentimos, pero aún NO estamos en esta zona. Sin embargo, puedes solicitar tu servicio dentro de las Áreas con Cobertura en algún café, restaurante u oficina.";
			} else {
				var message = "Sorry, but we are NOT in your home area yet, however, you can request your service within the covered areas, in a cafe, restaurant, or";
			}

			res.json({
				status: 400,
				message
			})
		}else{
			if (lang === "es") {
				var message = "disponible";
			} else {
				var message = "Black Patch is available";
			}
			res.json({
				status: 200,
				message
			})
		}

 	}catch (e) {
		res.json({
			status: 500,
			message: "Internal server error"
		});
	}
})

//technician review request

router.post("/tech/review", async (req, res) => {
	try {
		const { lang } = req.body;
		const technician = await UserRequest.findOne({
			where: {
				technicianId: req.body.technicianId,
				bookingId: req.body.bookingId
			}
		});

		if (technician) {
			var request_update = await UserRequest.update(
				{ technician_Status: "reviewing" },
				{
					where: {
						bookingId: req.body.bookingId,
						technicianId: req.body.technicianId
					}
				}
			);
			if (request_update) {
				if (lang === "es") {
					var message = "revisión técnica..";
				} else {
					var message = "technician reviewing..";
				}
				res.json({
					status: true,
					message
				});
			} else {
				if (lang === "es") {
					var message =
						"algo salió mal por favor intente nuevamente más tarde";
				} else {
					var message = "something went wrong please try again later";
				}
				res.json({
					status: false,
					message
				});
			}
		} else {
			if (lang === "es") {
				var message =
					"algo salió mal por favor intente nuevamente más tarde";
			} else {
				var message = "sin reserva aún";
			}
			res.json({
				status: false,
				message
			});
		}
	} catch (e) {
		res.json({
			status: 500,
			message: "Internal server error"
		});
	}
});

//technician request accept
router.post("/tech/accept-booking", async (req, res) => {
	try {
		var discountCount;
		const { bookingId, technicianId, lang } = req.body;

		// const technician = await UserRequest.findOne({
		// 	where: {
		// 		technicianId,
		// 		bookingId
		// 	}
		// });

		const tech = await Technician.findOne({ id : technicianId });
		
		// if (technician) {
			req.body.technician_Status = "accept";
			var book_status = await UserRequest.update(req.body, {
				where: {
					[Op.and]: [
						{
							bookingId
						},
						{
							technicianId
						}
					]
				}
			});

			const bookDiscount = await Booking.findOne({
				where: {
					id: bookingId
				}
			});
			
			if (bookDiscount.discount_amount) {
				var percentage =
					(parseInt(req.body.total_amount) *
						parseInt(bookDiscount.discount_amount)) /
					100;
				discountCount = parseInt(req.body.total_amount) - percentage;
			} else {
				discountCount = req.body.total_amount;
			}

			const l = tech.username.length;
			const firstIn = tech.username.substring(0,2);
			const lastIn = tech.username.substring(l-3,l-1);
			const serviceDate = moment(bookDiscount.dateTime).format('DDMMYY');
			const serviceHour = moment(bookDiscount.dateTime).format('HH');
			const zip = tech.zip;
			const brand = bookDiscount.modelType ? bookDiscount.modelType : "XXX";
			const model = bookDiscount.modelName;
			const color = bookDiscount.modelColor ? bookDiscount.modelType : "#YYY";
			let unique_id = firstIn + lastIn + serviceDate + serviceHour + zip + brand + model + color;
			unique_id = unique_id.split(' ').join('').toUpperCase();
			
			var booking_status = await Booking.update(
				{
					total_amount: req.body.total_amount,
					afterDiscount_amount: discountCount,
					user_seen_unseen:true,
					unique_id
				},
				{
					where: {
						[Op.and]: [
							{
								id: bookingId
							},
							{
								technicianId
							}
						]
					}
				}
			);
			if (booking_status) {
				const bookingData = await Booking.findOne({
					where: { id: bookingId },
					attributes: ["userId"]
				});
				const tokens = await Session.findOne({
					where: {
						userId: bookingData.userId
					},
					attributes: ["fcm_token"]
				});
				if (lang === "es") {
                    var noti_title = "Respuesta del técnico";
                    var noti_message = "Ha contestado tu Patch.";
                } else {
                    var noti_title = "Technician Response";
                    var noti_message = "You have new technician response";
                }
				if(tokens)
				{

					var noti = new Notification({
                        title: noti_title,
                        notification_type: "book_user",
                        message: noti_message,
                        data: bookingId,
                        user_to: bookingData.userId,
                        user_from: technicianId
                    });
					await noti.save();
				}

				await notify.notify(
                    tokens.fcm_token,
                    {
                        message: noti_message,
                        bookingId: bookingId,
                        technicaianId: technicianId,
                        type: "book_user"
                    },
                    2
                );
				if (lang === "es") {
					var message = "solicitud es aceptada";
				} else {
					var message = "request is accepted";
				}
				res.json({
					status: true,
					message
				});
			} else {
				if (lang === "es") {
					var message =
						"algo salió mal por favor intente nuevamente más tarde";
				} else {
					var message = "something went wrong please try again later";
				}
				res.json({
					status: false,
					message
				});
			}
		// } else {
		// 	if (lang === "es") {
		// 		var message = "Esta reserva ha expirado";
		// 	} else {
		// 		var message = "This booking is expired";
		// 	}
		// 	res.json({
		// 		status: false,
		// 		message
		// 	});
		// }
	} catch (e) {
		res.json({
			status: 500,
			message: "Internal server "+ e
		});
	}
});

//technician request reject

router.post("/tech/reject-booking", async (req, res) => {
	try {
		const { lang } = req.body;
		await UserRequest.update(
			{ technician_Status: "rejected" },
			{
				where: {
					bookingId: req.body.bookingId,
					technicianId: req.body.technicianId
				}
			}
		);
		await Booking.update(
			{
				status: "pending",
				technicianId: null
			},
			{
				where: {
					id: req.body.bookingId
				}
			}
		);

		const bookingData = await Booking.findOne({
			where: { id: req.body.bookingId },
			attributes: ["userId"]
		});
		const tokens = await Session.findOne({
			where: {
				userId: bookingData.userId
			},
			attributes: ["fcm_token"]
		});
		if (lang === "es") {
            var noti_title = "Respuesta del técnico";
            var noti_message = "El técnico rechazó su solicitud!";
        } else {
            var noti_title = "Technician Response";
            var noti_message = "Technician rejected your accept!";
        }
		if(tokens)
		{

			var noti = new Notification({
                title: noti_title,
                notification_type: "book_user",
                message: "You have new technician response",
                data: req.body.bookingId,
                user_to: bookingData.userId,
                user_from: bookingData.userId
            });
			await noti.save();
		}

		await notify.notify(
            tokens.fcm_token,
            {
                message: noti_message,
                bookingId: req.body.bookingId,
                technicaianId: bookingData.userId,
                type: "book_user"
            },
            2
        );
  
		if (lang === "es") {
			var message = "solicitud es rechazada";
		} else {
			var message = "request is rejected";
		}
		res.json({
			status: true,
			message
		});
	} catch (e) {
		res.json({
			status: "500",
			error: e,
			message: "Internal server error"
		});
	}
});

//get-notification-data-screeen

router.get("/technician/get-Mybooking", async (req, res) => {
	try {
		var booking = [];
		const { technicianId, lang } = req.query;
		
		const user_request = await UserRequest.findAll({
			where: {
				technicianId: technicianId,
				[Op.or]: [
					{
						user_Status: "pending"
					},
					{
						user_Status: "confirmed"
					}
				]
			},

			include: [
				{
					model: Booking,
					include: [
						{
							model: User
						}
					],
					order: ['extra_payment_status','ASC'],
				}
			]

		});
			
		// res.json(user_request);
		user_request.forEach(item => {
			
			let time = item.createdAt;
			let now = new Date().toLocaleString("en-US", {
				timeZone: "Asia/Kolkata" 
			});
			let requestTime = new Date(time).toLocaleString("en-US", {
				timeZone: "Asia/Kolkata" 
			});
			
			let t = new Date(now) - new Date(requestTime);
			let after10 = 60000 * 30; //1 minute * 60

			if (item.technician_Status != "rejected" && (item.technician_Status == "accept" || t < after10) && (item.booking.booking_complete === false)) {
				var datad = {
					id: item.booking.id,
					user_seen_unseen:item.booking.user_seen_unseen,
					tech_seen_unseen:item.booking.tech_seen_unseen,
					bookingId:item.booking.bookingId ? item.booking.bookingId : "NA",
					profile_pic: item.booking.user.profile_pic,
					repair_estimate: item.booking.repair_estimate,
					description: item.booking.description,
					dateTime: item.tech_delevery,
					user_time: item.booking.dateTime,
					username: item.booking.user.username,
					modelName: item.booking.modelName,
					user_status: item.user_Status,
					half_payment: item.booking.half_payment,
					full_payment: item.booking.full_payment,
					startrepaiar: item.booking.startrepaiar,
					EndRepair: item.booking.EndRepair,
					technician_Status: item.technician_Status,
					bookAddress: item.booking.address,
					booking_complete: item.booking.booking_complete,
					extra_payment: item.booking.extra_payment,
					extra_payment_status: item.booking.extra_payment_status
				};
				booking.push(datad);
			}
		});
		let sortedBooking = [];
		let dateBookings = [];
		for(let book of booking){
			if(book.extra_payment_status){ sortedBooking.push(book); }
			else{ dateBookings.push(book); }
		}
		dateBookings.sort((v1,v2)=>{
			return new Date(v1.dateTime) - new Date(v2.dateTime);
		})
		booking = [...sortedBooking,...dateBookings];
		
		// const lastBooking = booking[0];
		// const firstBooking = booking[booking.length -1];
		// let time, lastMonth, lastYear, now, nowMonth, nowYear;
		// let customData = [];
		// if(lastBooking){
		// 	time = new Date(lastBooking.dateTime.substring(0,10));
		// 	lastMonth = time.getMonth();
		// 	lastYear = time.getFullYear();

		// 	now = new Date(firstBooking.dateTime.substring(0,10));
		// 	nowMonth = now.getMonth();
		// 	nowYear = now.getFullYear();

		// 	for(let i = nowYear; i >= lastYear; i--){
		// 		let monthEnd;
		// 		if(i === lastYear){
		// 			monthEnd = lastMonth;
		// 		}else{
		// 			monthEnd = 0;
		// 		}
		// 		for(let j = 11; j >= monthEnd; j--){
		// 			let bookings = booking.filter(b=>{
		// 				let dateB = new Date(b.dateTime.substring(0,10));
		// 				let month = dateB.getMonth();
		// 				let year = dateB.getFullYear();
		// 				if(month === j && year === i){
		// 					return true;
		// 				}else{
		// 					return false;
		// 				}
		// 			})
		// 			if(bookings.length !== 0){

		// 				let mnth = moment(j+1, 'MM').format('MMMM');
		// 				customData.push({
		// 					month: mnth,
		// 					year: i.toString(),
		// 					bookings				
		// 				})
		// 			}
		// 		}
		// 	}
		// }


		if (booking != "") {
			res.json({
				status: true,
				booking
			});
		} else {
			if (lang === "es") {
				var message = "Aún no hay reserva";
			} else {
				var message = "No booking yet";
			}
			res.json({
				status: false,
				message
			});
		}
	} catch (e) {
		res.json({ status: 500, message: "Internal server error",e });
	}
});

//technician booking history
router.get("/technician/booking_history", async (req, res) => {
	// try {
		var booking = [];
		const { technicianId, lang } = req.query;

		const user_request = await Booking.findAll({
			where: {
				technicianId: technicianId
			},
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: User
				}
			]
		});

		for (i = 0; i < user_request.length; i++) {
			if(user_request[i].booking_complete || user_request[i].technician_Status == "rejected"){

				var rat = await Rating.findAll({
					where: { bookingId: user_request[i].id }
				});
				if(rat!=""){
					var single_rating=(rat!='')?rat[0].dataValues.rates:0;
				}

				var datad = {
					id: user_request[i].id,
					profile_pic: user_request[i].user.profile_pic,
					repair_estimate: user_request[i].repair_estimate,
					description: user_request[i].description,
					dateTime: user_request[i].dateTime,
					username: user_request[i].user.username,
					modelName: user_request[i].modelName,
					// user_status: item.user_Status,
					technicaianId: user_request[i].technicianId,
					bookAddress: user_request[i].address,
					booking_complete: user_request[i].booking_complete,
					technician_rating: single_rating,
					createdAt: user_request[i].createdAt,
				};

				// console.log(datad);
				booking.push(datad);
			}
		}	
		

		booking.sort((v1,v2)=>{
			return new Date(v1.createdAt) - new Date(v2.createdAt);
		})
		
		const lastBooking = booking[0];
		const firstBooking = booking[booking.length -1];
		let time, lastMonth, lastYear, now, nowMonth, nowYear;
		let customData = [];
		if(lastBooking){
			lastMonth = lastBooking.createdAt.getMonth();
			lastYear = lastBooking.createdAt.getFullYear();

			nowMonth = firstBooking.createdAt.getMonth();
			nowYear = firstBooking.createdAt.getFullYear();

			for(let i = nowYear; i >= lastYear; i--){
				let monthEnd;
				if(i === lastYear){
					monthEnd = lastMonth;
				}else{
					monthEnd = 0;
				}
				for(let j = 11; j >= monthEnd; j--){
					let bookings = booking.filter(b=>{
						let dateB = new Date(b.createdAt.toString().substring(0,10));
						let month = b.createdAt.getMonth();
						let year = b.createdAt.getFullYear();
						if(month === j && year === i){
							return true;
						}else{
							return false;
						}
					})
					if(bookings.length !== 0){

						let mnth = moment(j+1, 'MM').format('MMMM');
						customData.push({
							month: mnth,
							year: i,
							bookings				
						})
					}
				}
			}
		}
		
		if (booking != "") {
			res.json({
				status: true,
				customData
			});
		} else {
			if (lang === "es") {
				var message = "Aún no hay reserva";
			} else {
				var message = "No booking yet";
			}
			res.json({
				status: false,
				message
			});
		}
	// } catch (e) {
	// 	res.json({ status: 500, message: "Internal server error" });
	// }
});

//technician notification data

router.get("/technician/get-booking-notification", async (req, res) => {
	// try {
		var booking = {};
		const { bookingId, technicianId, lang } = req.query;

		const user_request = await Booking.findOne({
			where: { id: bookingId, technicianId: technicianId },

			include: [
				{
					model: User
				},
				{
					model: UserRequest
				}
			]
		});
		
		// res.json(user_request);
		if (!user_request) {
			if (lang === "es") {
				var message = "Aún no hay reserva";
			} else {
				var message = "No booking yet";
			}
			return res.json({
				status: false,
				message
			});
		}

		var rat = await Rating.findAll({
				where: { bookingId: bookingId }
		});
		console.log(rat);
		if(rat!=""){

			console.log(rat[0].dataValues.rates);
			var single_rating=(rat!='')?rat[0].dataValues.rates:0;
		}
		 

		const room = await Conversations.findOne({
			where: {booking_id: bookingId }
		});
		 
		// user_request.forEach(item => {
		booking = {
			id: user_request.id,
			issue: JSON.parse(user_request.issue),
			image: JSON.parse(user_request.image),
			video: user_request.video,
			repair_estimate: user_request.repair_estimate,
			description: user_request.description,
			dateTime: user_request.dateTime,
			userId: user_request.userId,
			username: user_request.user.username,
			email: user_request.user.email,
			phone: user_request.user.phone,
			address: user_request.user.address,
			profile_pic: user_request.user.profile_pic,
			modelName: user_request.modelName,
			modelColor: user_request.modelColor ? user_request.modelColor : '',
			modelType: user_request.modelType ? user_request.modelType : '',
			bookAddress: user_request.address,
			user_status: user_request.requests[0].user_Status,
			technician_Status: user_request.requests[0].technician_Status,
			tech_description: user_request.requests[0].tech_description,
			tech_estimate: user_request.requests[0].tech_estimate,
			tech_delevery: user_request.requests[0].tech_delevery,
			half_payment: user_request.half_payment,
			full_payment: user_request.full_payment,
			startrepaiar: user_request.startrepaiar,
			EndRepair: user_request.EndRepair,
			extra_payment: user_request.extra_payment,
			extra_payment_status: user_request.extra_payment_status,
			total_amount:user_request.total_amount,
			technician_rating:single_rating
		};
		const rs = await Message.findOne({
			where: {booking_id: bookingId }
		});

		// if(room){
		// 	if(technicianId==room.receiver){

		// 		var tech=room.sender;
		// 	}else if(technicianId==room.sender){
				
		// 		var tech=room.receiver;
		// 	}
		// 	//var user=room.receiver;
		// 	//var tech=room.sender;
			
			
		// }else{
		// 	booking["unread_messages"] =0;
		// }

		const totalmsg = await Message.count({
			where: {receiver: technicianId ,seen:0 , booking_id: bookingId}
		}); 
		booking["unread_messages"] = totalmsg;
		const payment = await Payment.findAll({
			where: { bookingId: user_request.id }
		});
		if (payment != "") {
			payment.forEach(element => {
				booking["payed_amount"] =
					parseInt(element.amount) + parseInt(element.coupan_amount);

				booking["pending_amount"] =parseInt(user_request.total_amount) -parseInt(element.amount) -parseInt(element.coupan_amount);
			});
		} else {
			booking["payed_amount"] = 00;

			booking["pending_amount"] = parseInt(user_request.total_amount);
		}

		// booking.push(datad);
		// });

		if (booking != "") {
			res.json({
				status: true,
				booking
			});
		} else {
			if (lang === "es") {
				var message = "Aún no hay reserva";
			} else {
				var message = "No booking yet";
			}
			res.json({
				status: false,
				message
			});
		}
	// } catch (e) {
	// 	res.json({ status: 500, message: "Internal server error" });
	// }
});

// user section

//user accept

router.post("/user/accept_booking", async (req, res) => {
	 try {
		const { lang } = req.body;

		if (req.body.coupanId != "") {
			await Coupan.update(
				{ isUsed: true },
				{
					where: {
						id: req.body.coupanId
					}
				}
			);
		}
		await UserRequest.update(
			{ user_Status: "confirmed" },
			{
				where: {
					bookingId: req.body.bookingId,
					technicianId: req.body.technicianId
				}
			}
		);
		await Booking.update(
			{ status: "confirmed", half_payment: true,tech_seen_unseen: true },
			{
				where: {
					id: req.body.bookingId
				}
			}
		);

		var payment = new Payment(req.body);
		await payment.save();
		const tokens = await Session.findOne({
			where: {
				technicianId: req.body.technicianId
			},
			attributes: ["fcm_token"]
		});
		if (lang === "es") {
            var noti_title = "confirmación del cliente";
            var noti_message = "Tu servicio ha sido confirmado";
        } else {
            var noti_title = "User Confirmation";
            var noti_message = "Your request has been confirmed";
        }
        // res.json(tokens.fcm_token);
		if(tokens)
		{
			if(tokens.fcm_token!=""){


				var noti = new Notification({
	                title: noti_title,
	                notification_type: "accept_tech",
	                message: noti_message,
	                data: req.body.bookingId,
	                user_to: req.body.technicianId,
	                user_from: req.body.userId
				});
				
				await noti.save();

				await notify.notify(
					tokens.fcm_token,
					{
						message:noti_message,
						bookingId: req.body.bookingId,
						technicaianId: req.body.technicianId,
						type: "accept_tech"
					},
					4
				);
			}
		}

		// res.json('hello');
		if (lang === "es") {
			var message = "Solicitud confirmada con éxito";
		} else {
			var message = "Request confirmed Successfully";
		}
		res.json({
			status: true,
			message
		});
	 } catch (e) {
	 	res.json({
	 		status: "500",
	 		error: e,
	 		message: "Internal server error "+e
	 	});
	 }
});

//user reject request

router.post("/user/reject-booking", async (req, res) => {
	try {
		const { lang } = req.body;
		var userrequest = await UserRequest.update(
			{ user_Status: "reject" },
			{
				where: {
					bookingId: req.body.bookingId,
					technicianId: req.body.technicianId
				}
			}
				);

				var booking_data = await Booking.findOne({
					where:{
						id:req.body.bookingId
					}
				})
				
		if (!userrequest) {
			if (lang === "es") {
				var message = "Solicitud no válida";
			} else {
				var message = "invalid request";
			}
			return res.json({
				status: false,
				message
			});
		}

		await Booking.update(
			{
				status: "pending",
				technicianId: null,
				total_amount: null,
				tech_seen_unseen : true
		   
			},
			{ where: { id: req.body.bookingId } }
		);

		const tokens = await Session.findOne({
			where: {
				technicianId: req.body.technicianId,
				isActive: true
			},
			attributes: ["fcm_token"]
		});
		if (lang === "es") {
			var noti_title = "Lo sentimos, tu servicio fue cancelado";
            var messagee = "Lo sentimos, tú servicio fue rechazado";
        } else {
			var messagee = "Sorry, your service was cancelled.";
			var noti_title = "User Reject Booking";
        }
        // res.json(tokens);
		if(tokens)
		{
			if(tokens.fcm_token!=""){

				var noti = new Notification({
	                title: noti_title,
	                notification_type: "reject_tech",
	                message: messagee,
	                data: req.body.bookingId,
	                user_to: req.body.technicianId,
	                user_from: booking_data.userId
	            });
				await noti.save();
				
				await notify.notify(
		            tokens.fcm_token,
		            {
		                message: messagee,
		                bookingId: req.body.bookingId,
		                technicaianId: req.body.technicianId,
		                type: "reject_tech"
		            },
		            3
		        );
			}
		}
				

	

		const user_request = await UserRequest.findAll({
			where: {
				bookingId: req.body.bookingId,
				technician_Status: "accept"
			}
		});

		user_request.forEach(async function(tech_Id) {
			const user_booking = await Booking.findOne({
				where: { id: req.body.bookingId }
			});
			var id = user_booking.id;

			let limit = 10;

			const lat = user_booking.lat;
			const lng = user_booking.lng;

			const distance = `( 3959 * acos ( cos ( radians(${lat}) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(${lng}) ) + sin ( radians(${lat}) ) * sin( radians( lat ) ) ) )`;
			query = `SELECT id,lat, lng, ${distance} AS distance FROM technicians WHERE id!= '${tech_Id.technicianId}' HAVING distance < 10 ORDER BY distance limit ${limit}`;
			const result = seq
				.query(query, {
					type: seq.QueryTypes.SELECT
				})
				.then(async tech_location => {
					let requests = tech_location.reduce(
						(promiseChain, item) => {
							return promiseChain.then(
								() =>
									new Promise(async resolve => {
										
										await Booking.update(
											{
												status: "pending",
												technicianId: item.id
											},

											{ where: { id: id } }
										);

										const user_request = new UserRequest({
											technician_Status: "pending",
											user_Status: "pending",
											technicianId: item.id,
											bookingId: id
										});
										await user_request.save();

										const tokens = await Session.findOne({
											where: {
												technicianId: item.id,
												isActive: true
											},
											attributes: [
												"fcm_token",
												"language"
											]
										});
									   if(tokens)
									   {
										   if (tokens.language === "es") {
                                               var message =
												   "Tienes una nueva solicitud de reserva";
												 var noti_title =
                                                     "Reserva de cliente";
                                           } else {
                                               var message =
												   "You have a new booking request";
											 var noti_title = "User Booking";
										   }
										   var noti = new Notification({
                                               title: noti_title,
                                               notification_type: "book_tech",
                                               message: noti_message,
                                               data: id,
                                               user_to: item.id,
                                               user_from: booking.userId
                                           });
                                           await noti.save();
                                           await notify.notify(
                                               tokens.fcm_token,
                                               {
                                                   message,
                                                   bookingId: id,
                                                   technicaianId: item.id,
                                                   type: "book_tech"
                                               }
                                           );

									   }
										
										asyncFunction(id, item.id, resolve);
									})
							);
						},
						Promise.resolve()
					);

					requests.then(() => console.log("done"));
				});
		});
		if (lang === "es") {
			var message = "solicitud es rechazada";
		} else {
			var message = "request is rejected";
		}
		res.json({
			status: true,
			message
		});
	} catch (e) {
		res.json({
			status: "500",
			error: e,
			message: "Internal server error"
		});
	}
});

//user booking history

router.get("/user/getMyBooking", async (req, res) => {
	// try {
		var booking = [];

		const { userId, lang } = req.query;

		var booking_data = await Booking.findAll({
			where: {
				userId
			},
			
		});

	
		// res.json(booking_data);
		if (booking_data != "") {
			var ii = 0;
			var processedItems = 0;
			var datad;
			for (i = 0; i < booking_data.length; i++) {
				
				if (booking_data[i].technicianId)
				{
					
                        var booking_req = await UserRequest.findOne({
                            where: {
                                bookingId: booking_data[i].id
                            }
                        });
						
						if(booking_req){
							
							var tech_info = await Technician.findOne({
								where: {
									id: booking_req.technicianId
								}
							});
							if (booking_req.technician_Status == "accept" && booking_data[i].booking_complete==false && booking_req.user_Status != "reject") {

								var rat = await Rating.findAll({
											where: {
												technicianId: booking_req.technicianId
											},
											attributes: [ [ Sequelize.fn( "avg", Sequelize.col("rates") ), "rating" ] ]
										});
										if (rat != "") { 
											var totalRating= rat[0].dataValues.rating
										}else{
											// console.log("else"+rat.rating);
											var totalRating= 0;
										}
								
								datad = {
									id: booking_data[i].id,
									tech_seen_unseen:booking_data[i].tech_seen_unseen,
									user_seen_unseen:booking_data[i].user_seen_unseen,
									issue: JSON.parse(booking_data[i].issue),
									image: JSON.parse(booking_data[i].image),
									modelColor: booking_data[i].modelColor ? booking_data[i].modelColor : '',
                                	modelType: booking_data[i].modelType ? booking_data[i].modelType : '',
									video: booking_data[i].video,
									modelName: booking_data[i].modelName,
									repair_estimate: booking_data[i].repair_estimate,
									description: booking_data[i].description,
									dateTime: booking_data[i].dateTime,
									half_payment: booking_data[i].half_payment,
									full_payment: booking_data[i].full_payment,
									startrepaiar: booking_data[i].startrepaiar,
									EndRepair: booking_data[i].EndRepair,
									booking_complete: booking_data[i].booking_complete,
									extra_payment_status: booking_data[i].extra_payment_status,
									username: tech_info.username,
									profile_pic: tech_info.profile_pic,
									user_Status: booking_req.user_Status,
									technician_Status: booking_req.technician_Status,
									technicianId: tech_info.id,
									technician_rating:(totalRating)?totalRating:0
								};
								booking.push(datad);
							}
						}

				}
                processedItems += 1;

				if (processedItems === booking_data.length) {
					if (booking == "") {
						if (lang === "es") {
							var message = "Aún no hay solicitud";
						} else {
							var message = "No request yet";
						}
						res.json({
							status: false,
							message
						});
					} else {

						let sortedBooking = [];
						let dateBookings = [];
						for(let book of booking){
							if(book.extra_payment_status){ sortedBooking.push(book); }
							else{ dateBookings.push(book); }
						}
						dateBookings.sort((v1,v2)=>{
							return new Date(v1.dateTime) - new Date(v2.dateTime);
						})
						booking = [...sortedBooking,...dateBookings];
						res.json({
							status: true,
							booking
						});
					}
				}
			
			}
		} else {
			if (lang === "es") {
				var message = "Aún no hay reserva";
			} else {
				var message = "No booking yett";
			}
			res.json({
				status: false,
				message
			});
		}
	// } catch (e) {
		// res.json({ status: 500, message: e });
	// }
});

router.get("/user/bookingOnReview", async (req, res) => {
	try {
		var booking = [];

		const { userId, lang } = req.query;

		var booking_data = await Booking.findAll({
			where: {
				userId
			},
		});

	
		// res.json(booking_data);
		if (booking_data != "") {
			var ii = 0;
			var processedItems = 0;
			var datad;
			for (i = 0; i < booking_data.length; i++) {

				if (booking_data[i].technicianId)
				{
                        var booking_req = await UserRequest.findOne({
                            where: {
                                bookingId: booking_data[i].id
                            }
                        });
						if(booking_req){

							let time = booking_req.createdAt;
							let now = new Date().toLocaleString("en-US", {
								timeZone: "Asia/Kolkata" 
							});
							let requestTime = new Date(time).toLocaleString("en-US", {
								timeZone: "Asia/Kolkata" 
							});
							
							let t = new Date(now) - new Date(requestTime);
							let after10 = 60000 * 30; //1 minute * 60
						
							// res.json(booking_req);
							var tech_info = await Technician.findOne({
								where: {
									id: booking_req.technicianId
								}
							});
							if (booking_req.user_Status == "pending" && booking_data[i].booking_complete==false && booking_req.technician_Status=="pending" && t < after10) {

								var rat = await Rating.findAll({
											where: {
												technicianId: booking_req.technicianId
											},
											attributes: [ [ Sequelize.fn( "avg", Sequelize.col("rates") ), "rating" ] ]
										});
										if (rat != "") { 
											var totalRating= rat[0].dataValues.rating
										}else{
											// console.log("else"+rat.rating);
											var totalRating= 0;
										}
								
								datad = {
									id: booking_data[i].id,
									tech_seen_unseen:booking_data[i].tech_seen_unseen,
									user_seen_unseen:booking_data[i].user_seen_unseen,
									issue: JSON.parse(booking_data[i].issue),
									image: JSON.parse(booking_data[i].image),
									video: booking_data[i].video,
									modelName: booking_data[i].modelName,
									modelColor: booking_data[i].modelColor ? booking_data[i].modelColor : '',
                                	modelType: booking_data[i].modelType ? booking_data[i].modelType : '',
									repair_estimate: booking_data[i].repair_estimate,
									description: booking_data[i].description,
									dateTime: booking_data[i].dateTime,
									booking_complete: booking_data[i].booking_complete,
									username: tech_info.username,
									extra_payment_status: booking_data[i].extra_payment_status,
									profile_pic: tech_info.profile_pic,
									user_Status: booking_req.user_Status,
									technician_Status: booking_req.technician_Status,
									technicianId: tech_info.id,
									technician_rating:(totalRating)?totalRating:0
								};
								booking.push(datad);
							}
						}
				}
                processedItems += 1;

				if (processedItems === booking_data.length) {
					if (booking == "") {
						if (lang === "es") {
							var message = "Aún no hay solicitud";
						} else {
							var message = "No request yet";
						}
						res.json({
							status: false,
							message
						});
					} else {
						
						let sortedBooking = [];
						let dateBookings = [];
						for(let book of booking){
							if(book.extra_payment_status){ sortedBooking.push(book); }
							else{ dateBookings.push(book); }
						}
						dateBookings.sort((v1,v2)=>{
							return new Date(v1.dateTime) - new Date(v2.dateTime);
						})
						booking = [...sortedBooking,...dateBookings];

						res.json({
							status: true,
							booking
						});
					}
				}
			
			}
		} else {
			if (lang === "es") {
				var message = "Aún no hay reserva";
			} else {
				var message = "No booking yett";
			}
			res.json({
				status: false,
				message
			});
		}
	} catch (e) {
		res.json({ status: 500, message: e && e.message ? e.message : "Internal server error" });
	}
});

async function getTechniciansRating(tech) {
	var rat = await Rating.findAll({
		where: {
			technicianId: tech
		},
		attributes: [ [ Sequelize.fn( "avg", Sequelize.col("rates") ), "rating" ] ]
	});
	if (rat != "") { 

		//const userIds = JSON.stringify(rat)
		 console.log(rat[0].dataValues.rating);
		// console.log(rat['ratings']);
		return rat[0].dataValues.rating;	
		// console.log("if"+rat.rating);
	}else{
		// console.log("else"+rat.rating);
		return 0;
	}

}
router.get("/user/booking_history", async (req, res) => {
	
		var booking = [];
		const { userId, lang } = req.query;
		const booking_data = await Booking.findAll({
			where: {
				userId
				// status: "confirmed"
			},
			order: [['createdAt','ASC']],
			include: [
				{
					model: UserRequest,
					include: [
						{
							model: Technician,
						}
					]
				}
			]
		});
		var datad = {};
		if (booking_data != "") {
			var processedItems = 0;
			var datad;
			for (i = 0; i < booking_data.length; i++) {

				if (booking_data[i].booking_complete === true) {

					var rat = await Rating.findAll({
								where: {
									technicianId: booking_data[i].requests[0].technician.id
								},
								attributes: [ [ Sequelize.fn( "avg", Sequelize.col("rates") ), "rating" ] ]
							});
							if (rat != "") { 
									var totalRating= rat[0].dataValues.rating
							}else{
								var totalRating= 0;
							}

							datad = {
								id: booking_data[i].id,
								issue: JSON.parse(booking_data[i].issue),
								image: JSON.parse(booking_data[i].image),
								video: booking_data[i].video,
								modelName: booking_data[i].modelName,
								repair_estimate: booking_data[i].repair_estimate,
								description: booking_data[i].description,
								dateTime: booking_data[i].dateTime,
								username: booking_data[i].requests[0].technician.username,
								profile_pic: booking_data[i].requests[0].technician.profile_pic,
								user_Status: booking_data[i].requests[0].user_Status,
								technician_Status: booking_data[i].requests[0].technician_Status,
								technicianId: booking_data[i].requests[0].technician.id,
								booking_complete: booking_data[i].booking_complete,
								technician_rating:(totalRating)?totalRating:0
							};
							booking.push(datad);
				}else{

					// return res.json(booking_data[i]);
					//var totalRating= 0;
					if(booking_data[i].requests.length > 0){

						var rat = await Rating.findAll({
								where: {
									technicianId: booking_data[i].requests[0].technician.id
								},
								attributes: [ [ Sequelize.fn( "avg", Sequelize.col("rates") ), "rating" ] ]
							});
							if (rat != "") { 
									var totalRating= rat[0].dataValues.rating
							}else{
								// console.log("else"+rat.rating);
								var totalRating= 0;
							}
						datad = {
							id: booking_data[i].id,
							issue: JSON.parse(booking_data[i].issue),
							image: JSON.parse(booking_data[i].image),
							video: booking_data[i].video,
							modelName: booking_data[i].modelName,
							repair_estimate: booking_data[i].repair_estimate,
							description: booking_data[i].description,
							dateTime: booking_data[i].dateTime,
							username: booking_data[i].requests[0].technician.username,
							profile_pic: booking_data[i].requests[0].technician.profile_pic,
							user_Status: booking_data[i].requests[0].user_Status,
							technician_Status: booking_data[i].requests[0].technician_Status,
							technicianId: booking_data[i].requests[0].technician.id,
							booking_complete: booking_data[i].booking_complete,
							technician_rating:(totalRating)?totalRating:0 
						};
						booking.push(datad);
					}
				}
				processedItems += 1;

				
			}
			if (processedItems === booking_data.length) {
				// res.json("ada");
				if (booking == "") {
					if (lang === "es") {
						var message = "Sin historial de reserva";
					} else {
						var message = "No booking history";
					}
					res.json({
						status: false,
						message
					});
				} else {
					res.json({
						status: true,
						booking
					});
				}
			}
		} else {
			if (lang === "es") {
				var message = "Sin historial de reserva";
			} else {
				var message = "No booking history";
			}
			res.json({
				status: false,
				message
			});
		}
	// } catch (e) {
	// 	res.json({ status: 500, message: "Internal server error" });
	// }
});

//user notification

router.get("/user/get-booking-notification", async (req, res) => {
	// try {
		
		var booking = [];
		const { bookingId, technicianId, userID } = req.query;

		const user_request = await UserRequest.findOne({
			where: { bookingId: bookingId, technicianId: technicianId },

			include: [
				{
					model: Booking,
					include: [
						{
							model: Technician
						}
					]
				}
			]
		});
		// res.json(user_request);
		if (user_request) {



			var totalmsg = await Message.count({
				where: {receiver: userID ,seen:0 , booking_id: bookingId}
			});
			
			 console.log(totalmsg);
			// if(totalmsg>0){
			
			// 	obj["unread_messages"] = totalmsg;

			// }else{
			// 	obj["unread_messages"]=0;				
			// }
			var obj = {
				id: user_request.booking.id,
				unique_id: "1234",
				issue: JSON.parse(user_request.booking.issue),
				image: JSON.parse(user_request.booking.image),
				video: user_request.booking.video,
				user_delevery: user_request.booking.dateTime,
				repair_estimate: user_request.booking.repair_estimate,
				tech_estimate: user_request.tech_estimate,
				tech_description: user_request.tech_description,
				tech_delevery: user_request.tech_delevery,
				technicianId: user_request.booking.technicianId,
				username: (user_request.booking.technician)?user_request.booking.technician.username:"",
				email: (user_request.booking.technician)?user_request.booking.technician.email:"",
				phone: (user_request.booking.technician)?user_request.booking.technician.phone:"",
				tech_address: (user_request.booking.technician)?user_request.booking.technician.address:"",
				profile_pic: (user_request.booking.technician)?user_request.booking.technician.profile_pic:"",
				modelName: (user_request.booking.modelName)?user_request.booking.modelName:"",
				modelColor: (user_request.booking.modelColor)?user_request.booking.modelColor:"",
				modelType: (user_request.booking.modelType)?user_request.booking.modelType:"",
				user_address: (user_request.booking.address)?user_request.booking.address:"",
				user_Status: (user_request.user_Status)?user_request.user_Status:"",
				technician_Status: (user_request.technician_Status)?user_request.technician_Status:"",
				half_payment: (user_request.booking.half_payment)?user_request.booking.half_payment:false,
				full_payment: (user_request.booking.full_payment)?user_request.booking.full_payment:false,
				total_estimate: (user_request.booking.total_amount)?user_request.booking.total_amount:"",
				booking_complete: (user_request.booking.booking_complete)?user_request.booking.booking_complete:false,
				EndRepair: (user_request.booking.EndRepair)?user_request.booking.EndRepair:false,
				startrepaiar: (user_request.booking.startrepaiar)?user_request.booking.startrepaiar:false,
				unread_messages:(totalmsg>0)?totalmsg:0
				// technician_rating: user_request.booking.technician.ratings[0].dataValues.rating
			};
			// res.json(obj);
			
				const payment = await Payment.findAll({
					where: { bookingId: bookingId }
				});
			
			// res.json(payment);
			var totalRating;
			var rat = await Rating.findAll({
						where: {
							technicianId: technicianId
						},
						attributes: [ [ Sequelize.fn( "avg", Sequelize.col("rates") ), "rating" ] ]
					});

			console.log(rat);
			if (rat.length>0) { 
					var totalRating= rat[0].dataValues.rating
			}else{
				// console.log("else"+rat.rating);
				var totalRating= 0;
			}
			// res.json(rat);
			if (rat.length>0) {
				obj["technician_rating"] = totalRating;
			} else {
				obj["technician_rating"] = 0;
			}

			const room = await Conversations.findOne({
				where: {booking_id: bookingId }
			});
			

			


			if (payment != "") {
				payment.forEach(element => {
					obj["payed_amount"] = parseInt(element.amount) + parseInt(element.coupan_amount); 
					obj["payble_amount"] = parseInt(obj.total_estimate) - parseInt(element.amount) - parseInt(element.coupan_amount);
				});
			} else {
				obj["payed_amount"] = 00;

				obj["payble_amount"] = parseInt(obj.total_estimate);
			}
			console.log(obj);
			res.json({
				status: true,
				booking: obj
			});
		} else {
			res.json({
				status: false,
				message: "No booking yet"
			});
		}
	// } catch (e) {
	// 	res.json({ status: 500, message: "Internal server error" });
	// }
});

//user booking history

router.get("/user/get-MyBooking-history", async (req, res) => {
	try {
		var booking = [];
		const { userId, lang } = req.query;
		const booking_data = await Booking.findAll({
			where: {
				userId,
				booking_complete: true
				// status: "accept"
			},

			include: [
				{
					model: UserRequest,
					include: [
						{
							model: Technician
						}
					]
				}
			]
		});
		if (booking_data != "") {

			var booking=[];
			// res.json(booking_data);
			booking_data.forEach(item => {

				var datad = {
					id: item.id,
					issue: JSON.parse(item.issue),
					image: JSON.parse(item.image),
					video: item.video,
					modelName: item.modelName,
					repair_estimate: item.repair_estimate,
					description: item.description,
					dateTime: item.dateTime,
					username: (item.requests===true)?item.requests[0].technician.username:"null",
					email: (item.requests===true)?item.requests[0].technician.email:"null",
					phone: (item.requests===true)?item.requests[0].technician.phone:"null",
					technicianId: (item.requests===true)?item.requests[0].technician.id:"null",
					address: (item.requests===true)?item.requests[0].technician.address:"null",
					profile_pic: (item.requests===true)?item.requests[0].technician.profile_pic:"null",
					tech_estimate: (item.requests===true)?item.requests[0].tech_estimate:"null",
					tech_delevery: (item.requests===true)?item.requests[0].tech_delevery:"null",
					user_Status: (item.requests===true)?item.requests[0].user_Status:"null",
					technician_Status: (item.requests===true)?item.requests[0].technician_Status:"null",
					tech_description: (item.requests===true)?item.requests[0].tech_description:"null",
					half_payment: (item.requests===true)?item.half_payment:"null",
					total_estimate:parseInt(item.repair_estimate) +parseInt((item.requests===true)?item.requests[0].tech_estimate:0)
				};
				booking.push(datad);
			});

			res.json({
				status: true,
				booking
			});
		} else {
			if (lang === "es") {
				var message = "Sin historial de reserva";
			} else {
				var message = "No booking history";
			}
			res.json({
				status: false,
				message
			});
		}
	} catch (e) {
		res.json({ status: 500, message: "Internal server error","er":e });
	}
});

router.put("/tech/startrepair", async (req, res) => {
	try {
		const { id, lang } = req.body;
		var date_time = moment().format("DD-MM-YYYY h:mm:ss a");

		var bookUpdate = await Booking.update(
			{
				startrepaiar: true,
				startrepaiar_date: date_time,
				user_seen_unseen:true
			},
			{ where: { id } }
		);

		var book = await Booking.findOne({ where: { id } });

		const tokens = await Session.findOne({
			where: {
				userId: book.userId,
				isActive: true
			},
			attributes: ["fcm_token"]
		});

		

		if (tokens != null) {
			if(lang ==='es')
			{
				var noti_title = "Comience a reparar";
				var noti_message = "El Patch ha comenzado el servicio";
			}else{
				var noti_title = "Start repairing";
				var noti_message = "The technician has started the service";
			}


			var noti = new Notification({
                title: noti_title,
                notification_type: "start_service",
                message: noti_message,
                data: id,
                user_to: book.userId,
                user_from: book.technicianId
            });
			await noti.save();

			await notify.notify(
                tokens.fcm_token,
                {
                    message: noti_message,
                    bookingId: id,
                    technicaianId: book.technicianId,
                    type: "start_service"
                },
                1
            );
		}

		if (bookUpdate) {
			if (lang === "es") {
				var message = "El servicio de reparación comienza ahora";
			} else {
				var message = "Repair service is start now";
			}
			res.json({
				status: true,
				message
			});
		} else {
			if (lang === "es") {
				var message = "Algo salió mal";
			} else {
				var message = "Something went wrong";
			}
			res.json({
				status: false,
				message
			});
		}
	} catch (e) {
		res.json({
			status: 500,
			message: "Internal server error"
		});
	}
});
router.put("/tech/EndRepair", async (req, res) => {
	// try {
		// res.json(req.body);
		const { id,lang } = req.body;
		var date_time = moment().format("DD-MM-YYYY h:mm:ss a");
		// res.json(date_time);
		var bookUpdate = await Booking.update(
			{
				EndRepair: true,
				EndRepair_date: date_time,
				user_seen_unseen:true
			},
			{ 
				where: { 
					id:req.body.id 
				}
			}
		);
		// res.json("asd");
		var book = await Booking.findOne({ where: { id } });
		const tokens = await Session.findOne({
			where: {
				userId: book.userId,
				isActive: true
			},
			attributes: ["fcm_token"]
		});
		if (lang === "es") {
            var noti_title = "Fin de reparación";
            var noti_message = "El técnico ha completado su servicio.";
        } else {
            var noti_title = "End repairing";
            var noti_message = "The technician has been completed your service";
        }

		if (tokens != null) {
			var noti = new Notification({
                title: noti_title,
                notification_type: "end_service",
                message: noti_message,
                data: id,
                user_to: book.userId,
                user_from: book.technicianId
            });
			await noti.save();
			await notify.notify(
                tokens.fcm_token,
                {
                    message: noti_message,
                    bookingId: id,
                    technicaianId: book.technicianId,
                    type: "end_service"
                },
                1
            );
		}

		if (bookUpdate) {
			if (lang === "es") {
				var message = "Termina tu servicio";
			} else {
				var message = "End your service";
			}
			res.json({
				status: true,
				message
			});
		} else {
			if (lang === "es") {
				var message = "Algo salió mal";
			} else {
				var message = "Something went wrong";
			}
			res.json({
				status: false,
				message
			});
		}
	// } catch (e) {
	// 	res.json({
	// 		status: 500,
	// 		message: "Internal server error",
	// 		a:e
	// 	});
	// }
});

router.post("/user/final_payment", async (req, res) => {
	try {
		// res.json(req.body);
		const { lang } = req.body;
		if (req.body.coupanId != "") {
			await Coupan.update(
				{ isUsed: true },
				{
					where: {
						id: req.body.coupanId
					}
				}
			);
		}
		var book = await Booking.update(
			{ full_payment: true, booking_complete: true },
			{
				where: {
					id: req.body.bookingId
				}
			}
		);
		
		var book_stat = await Booking.findOne({
			where: {
				id: req.body.bookingId
			}
		});
		const tokens = await Session.findOne({
			where: {
				technicianId: book_stat.technicianId
			},
			attributes: ["fcm_token"]
		});
		// res.json(tokens);

		if (lang === "es") {
            var noti_title = "Pago final del cliente";
            var noti_message = "El cliente realizó el pago final";
        } else {
            var noti_title = "User Final Payment";
            var noti_message = "User done the final payment";
        }
		var noti = new Notification({
            title: noti_title,
            notification_type: "final_payment",
            message: noti_message,
            data: req.body.bookingId,
            user_to: book_stat.technicianId,
            user_from: book_stat.userId
        });
		await noti.save();

		await notify.notify(
            tokens.fcm_token,
            {
                message: noti_message,
                bookingId: req.body.bookingId,
                technicianId: book_stat.technicianId,
                type: "final_payment"
            },
            4
        );
        if (book) {
			var payment = new Payment(req.body);
			await payment.save();
			if (payment) {
				if (lang === "es") {
					var message = "Pago exitoso";
				} else {
					var message = "Payment Successfully";
				}
				res.json({
					status: true,
					message
				});
			} else {
				if (lang === "es") {
					var message = "Algo salió mal";
				} else {
					var message = "Something went wrong";
				}
				res.json({
					status: false,
					message
				});
			}
		} else {
			res.json({
				status: false,
				message: "Something went wrong"
			});
		}
	} catch (e) {
		res.json({
			status: "500",
			error: e,
			message: "Internal server error"
		});
	}
});

module.exports = router;