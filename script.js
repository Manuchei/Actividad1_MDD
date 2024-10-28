class Carrito {
  constructor(productos) {
    this.productos = productos;
    this.carrito = [];
  }

  actualizarUnidades(sku, unidades) {
    const productoCarrito = this.carrito.find((item) => item.sku === sku);
    if (productoCarrito) {
      if (unidades > 0) {
        productoCarrito.unidades = unidades;
      } else {
        this.carrito = this.carrito.filter((item) => item.sku !== sku);
      }
    } else {
      if (unidades > 0) {
        const producto = this.productos.find((item) => item.SKU === sku);
        if (producto) {
          this.carrito.push({
            sku: producto.SKU,
            title: producto.title || producto.name,
            price: producto.price,
            unidades: unidades,
          });
        }
      }
    }
  }

  obtenerInformacionProducto(sku) {
    const productoCarrito = this.carrito.find((item) => item.sku === sku);
    if (productoCarrito) {
      return {
        sku: productoCarrito.sku,
        title: productoCarrito.title,
        price: productoCarrito.price,
        quantity: productoCarrito.unidades,
      };
    }
    return null;
  }

  obtenerCarrito() {
    const total = this.carrito.reduce(
      (acc, producto) => acc + producto.price * producto.unidades,
      0
    );
    return {
      total: total,
      currency: "€",
      products: this.carrito,
    };
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  let carritoInstancia;

  function cargarTabla(productos) {
    const tablaProducts = document.getElementById("cuerpoTabla");

    tablaProducts.innerHTML = "";

    productos.forEach((producto) => {
      const tr = document.createElement("tr");

      const tdProducto = document.createElement("td");

      const divProductoInfo = document.createElement("div");
      const nombreProducto = document.createElement("p");
      nombreProducto.innerText = producto.title || producto.SKU;

      const skuProducto = document.createElement("p");
      skuProducto.innerText = `SKU: ${producto.SKU}`;
      skuProducto.style.fontSize = "12px";
      skuProducto.style.color = "gray";

      divProductoInfo.appendChild(nombreProducto);
      divProductoInfo.appendChild(skuProducto);
      tdProducto.appendChild(divProductoInfo);

      const tdCantidad = document.createElement("td");

      const inputCantidad = document.createElement("input");
      inputCantidad.type = "number";
      inputCantidad.value = 0;
      inputCantidad.min = 0;

      const btnAgregar = document.createElement("button");
      btnAgregar.textContent = "+";
      const btnQuitar = document.createElement("button");
      btnQuitar.textContent = "-";

      const divAcciones = document.createElement("div");
      divAcciones.classList.add("cantidad-container");
      divAcciones.appendChild(btnQuitar);
      divAcciones.appendChild(inputCantidad);
      divAcciones.appendChild(btnAgregar);

      tdCantidad.appendChild(divAcciones);

      const tdPrecioUnidad = document.createElement("td");
      tdPrecioUnidad.innerText = producto.price + " €";

      const tdTotal = document.createElement("td");
      tdTotal.innerText = "0 €";

      let cantidad = 0;

      function actualizarCantidad() {
        cantidad = parseInt(inputCantidad.value) || 0;
        tdTotal.innerText = producto.price * cantidad + " €";
        carritoInstancia.actualizarUnidades(producto.SKU, cantidad);
        actualizarCarrito();
      }

      btnAgregar.addEventListener("click", function () {
        cantidad++;
        inputCantidad.value = cantidad;
        actualizarCantidad();
      });

      btnQuitar.addEventListener("click", function () {
        if (cantidad > 0) {
          cantidad--;
          inputCantidad.value = cantidad;
          actualizarCantidad();
        }
      });

      inputCantidad.addEventListener("input", actualizarCantidad);

      tr.appendChild(tdProducto);
      tr.appendChild(tdCantidad);
      tr.appendChild(tdPrecioUnidad);
      tr.appendChild(tdTotal);

      tablaProducts.appendChild(tr);
    });
  }

  function actualizarCarrito() {
    const carritoInfo = carritoInstancia.obtenerCarrito();
    const carritoContainer = document.getElementById("carrito");
    carritoContainer.innerHTML = "";

    carritoInfo.products.forEach((producto) => {
      const productoHTML = `
                <div class="producto-carrito">
                    <h4>${producto.title}</h4>
                    <p>${producto.unidades} x</p>
                    <p>Precio Total: ${producto.price * producto.unidades} €</p>
                </div>
            `;
      carritoContainer.innerHTML += productoHTML;
    });

    if (carritoInfo.products.length === 0) {
      carritoContainer.innerHTML = "<p>El carrito está vacío</p>";
    }

    document.getElementById("totalPrecio").innerText = carritoInfo.total + " €";
  }

  fetch("https://jsonblob.com/api/1298679055254413312")
    .then((response) => response.json())
    .then((data) => {
      const productos = data.products || data;
      carritoInstancia = new Carrito(productos);
      cargarTabla(productos);
    })
    .catch((error) => {
      console.error("Error al obtener los productos: ", error);
    });
});
