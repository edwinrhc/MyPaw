/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  // logical OR\r\n  const lat = -12.0331056;\r\n  const lng = -76.9994417;\r\n  const mapa = L.map(\"mapa-inicio\").setView([lat, lng], 12);\r\n\r\n  let markers = new L.FeatureGroup().addTo(mapa);\r\n\r\n//   console.log(markers);\r\n\r\n  let servicios = [];\r\n\r\n  // Filtros\r\n  const filtros = {\r\n    categoria: '',\r\n    precio: '',\r\n  };\r\n\r\n  const categoriasSelect = document.querySelector(\"#categorias\");\r\n  const preciosSelect = document.querySelector(\"#precios\");\r\n\r\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(mapa);\r\n\r\n  //Filtrados de categorias y precios\r\n  categoriasSelect.addEventListener(\"change\", (e) => {\r\n    filtros.categoria = +e.target.value;\r\n    // console.log(+e.target.value);\r\n    filtrarServicios();\r\n    \r\n  });\r\n\r\n  preciosSelect.addEventListener(\"change\", (e) => {\r\n    filtros.precio = +e.target.value;\r\n    // console.log(+e.target.value);\r\n    filtrarServicios();\r\n  });\r\n\r\n  const obtenerServicios = async () => {\r\n    try {\r\n      const url = \"/api/servicios\";\r\n      const respuesta = await fetch(url);\r\n      servicios = await respuesta.json();\r\n\r\n      mostrarServicios(servicios);\r\n    } catch (error) {\r\n      console.log(error);\r\n    }\r\n  };\r\n\r\n  const mostrarServicios = (servicios) => {\r\n\r\n\r\n    // Limpiar los markers previos\r\n    markers.clearLayers()\r\n\r\n\r\n    servicios.forEach((servicio) => {\r\n      // console.log(servicio);\r\n      // Agregar pines\r\n      const marker = new L.marker([servicio?.lat, servicio?.lng], {\r\n        autoPan: true,\r\n      }).addTo(mapa).bindPopup(`\r\n                <p class=\" text-indigo-600 font-bold\">${servicio.categoria.nombre}</p>\r\n                <h1 class=\"text-xl font-extrabold uppercase my-2\">${servicio?.titulo}</h1>\r\n                <a href=\"/servicio/${servicio.id}\" class=\"bg-indigo-400 block p-1 text-center font-bold rounded\"> <img class=\"h-32\" src=\"/uploads/${servicio?.imagen}\" alt=\"Imagen del servicio ${servicio?.titulo}\"> </a>\r\n                <p class=\" text-gray-600 font-bold\">${servicio.precio.nombre}</p>\r\n                <p class=\" text-indigo-600 font-bold\">${servicio.calle}</p>\r\n                <a href=\"/servicio/${servicio.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold rounded\">Ver Servicio</a>\r\n            \r\n            `);\r\n\r\n      markers.addLayer(marker);\r\n    });\r\n  };\r\n\r\n\r\n  const filtrarServicios = () => {\r\n    \r\n  \r\n    const resultado = servicios.filter(filtrarCategoria).filter(filtrarPrecio)\r\n     mostrarServicios(resultado)\r\n  }\r\n\r\n  const filtrarCategoria  = (servicio) => {\r\n    return filtros.categoria ? servicio.categoriaId === filtros.categoria : servicio\r\n  }\r\n\r\n  const filtrarPrecio  = (servicio) => {\r\n    return filtros.precio ? servicio.precioId === filtros.precio : servicio\r\n  }\r\n\r\n  obtenerServicios();\r\n})();\r\n\n\n//# sourceURL=webpack://reservamascota/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;