## Registro del funcionamiento del deploy.

Vamos a contruir un protocolo reforzado con código que va a resultar en el deploy de la aplicación a nuestros servidores. Al final, vamos a tener un workflow para ir paso a paso del código que estamos escribiendo a la aplicación levantada en IIS.

1. Primero hacemos el commit que queremos deployar sobre cualquier branch. A continuación tageamos el commit.
    > Para esto, tenemos que ver cual es el último tag de nuestra branch. Tageamos el commit con el valor del último tag de nuestra branch más uno a la segunda numeración. Esto sería n.m -> n.m+1.
    > Ejemplo: 4.3 -> 4.4
    >
    > Si estamos tageando una branch por primera vez, entonces tomamos el tag de la branch base, le sumamos uno a la primera numeración y reseteamos la segunda a 0. Esto sería n.m -> n+1.0.
    > Ejemplo: 4.4 -> 5.0
    >
    > También podemos hacer un script que haga esto automáticamente (ya que la numeración del tag no es arbitraria y está completamente determinada por la numeración anterior).
2. Despues de tagearlo, le damos a "actualizar aplicación" en el panel. El commit tageado va a aparecer en el dropdown.
3. Elegimos la versión "target" a la cual queremos actualizar la aplicación y le damos a Build y Deploy. Esto va a iniciar un procedimiento automático que terminará con el deploy de la aplicación a IIS.
