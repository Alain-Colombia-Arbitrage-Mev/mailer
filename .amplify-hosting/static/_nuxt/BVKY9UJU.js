import{c as i,o as d,a as t,q as F,z as G,E as y,h as Y,r as f,e as K,k as J,b as u,s as r,t as p,d as L,l as c,v as m,m as Q,F as D,g as H,y as j,D as W,n as X}from"#entry";import{u as Z}from"./C4JpkZNp.js";import{r as ee}from"./17oaNzG6.js";import{r as te}from"./BKE9UY2T.js";import{r as oe}from"./Dp_75vtG.js";import{r as se}from"./DWNj0d99.js";import"./DMoW-9xf.js";function re(V,v){return d(),i("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true","data-slot":"icon"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"})])}const ne={class:"min-h-screen bg-gray-50"},ae={class:"bg-white shadow-sm border-b border-gray-200"},le={class:"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"},ie={class:"flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0"},de={class:"flex items-center"},ce={class:"text-xl sm:text-2xl font-bold text-gray-900"},pe={class:"flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"},ue=["disabled"],me=["disabled"],be={class:"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8"},xe={class:"grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8"},ge={class:"xl:col-span-2"},ye={class:"bg-white shadow-sm rounded-xl border border-gray-200"},fe={class:"p-4 sm:p-6 space-y-6"},ve={class:"grid grid-cols-1 md:grid-cols-2 gap-4"},he={class:"border border-gray-300 rounded-t-lg bg-gray-50 px-3 py-2 flex flex-wrap items-center gap-2"},we={class:"relative border-l border-r border-b border-gray-300 rounded-b-lg"},ke=["innerHTML"],_e={class:"bg-blue-50 border border-blue-200 rounded-lg p-4"},Ce={class:"grid grid-cols-2 md:grid-cols-4 gap-2 text-xs"},Ee=["onClick","title"],Te={class:"xl:col-span-1 space-y-6"},Me={class:"bg-white shadow-sm rounded-xl border border-gray-200"},Pe={class:"p-4"},Le=["innerHTML"],De={key:1,class:"text-center text-gray-500 py-8"},He={class:"bg-white shadow-sm rounded-xl border border-gray-200"},je={class:"p-4 space-y-2"},Ve=["onClick"],ze={class:"font-medium"},Ne={class:"text-xs text-gray-500"},Ue={class:"bg-white shadow-sm rounded-xl border border-gray-200"},$e={class:"p-4 space-y-4"},Ae={class:"flex items-center"},qe={class:"flex items-center"},Se={key:0,class:"fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"},Be={class:"relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white"},Ie={class:"flex justify-between items-center mb-4"},Oe={class:"border border-gray-200 rounded-lg p-4 bg-white max-h-96 overflow-y-auto"},Re=["innerHTML"],Fe={class:"flex justify-end mt-4"},Ze=F({__name:"new",setup(V){const v=G(),{supabase:h}=Z(),b=y(()=>!!v.query.id),_=y(()=>v.query.id),n=Y({name:"",subject:"",html_content:`<h1>Mi Plantilla</h1>
<p>Hola {{nombre}},</p>
<p>Este es el contenido de tu email.</p>
<p>Saludos,<br>El equipo</p>`,text_content:"",is_active:!0}),x=f(!1),l=f(!0),g=f(!1),a=f(),C=y(()=>n.name.trim()&&n.html_content.trim()),E=y(()=>{if(!n.html_content)return"";let o=n.html_content;return T.forEach(e=>{const s=new RegExp(`\\{\\{${e.key}\\}\\}`,"g");o=o.replace(s,e.example)}),o}),T=[{key:"{{nombre}}",description:"Nombre del contacto",example:"Juan Pérez"},{key:"{{apellido}}",description:"Apellido del contacto",example:"García"},{key:"{{email}}",description:"Email del contacto",example:"juan@ejemplo.com"},{key:"{{empresa}}",description:"Empresa del contacto",example:"Mi Empresa"},{key:"{{fecha}}",description:"Fecha actual",example:new Date().toLocaleDateString("es-ES")},{key:"{{unsubscribe_url}}",description:"URL de desuscripción",example:"#unsubscribe"},{key:"{{company_name}}",description:"Nombre de tu empresa",example:"Be-Mindpower"},{key:"{{company_address}}",description:"Dirección de tu empresa",example:"Calle Principal 123"}],z=[{id:"basic",name:"Básica",description:"Plantilla simple y limpia",content:`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h1 style="color: #2563eb; margin-bottom: 20px;">¡Hola {{nombre}}!</h1>
        
        <p>Este es el contenido de tu email.</p>
        
        <div style="margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Botón de Acción</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6b7280;">
            {{company_name}}<br>
            {{company_address}}<br>
            <a href="{{unsubscribe_url}}" style="color: #6b7280;">Desuscribirse</a>
        </p>
    </div>
</body>
</html>`},{id:"newsletter",name:"Newsletter",description:"Para boletines informativos",content:`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Newsletter {{company_name}}</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.8;">{{fecha}}</p>
    </header>
    
    <main style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #1f2937; margin-top: 0;">¡Hola {{nombre}}!</h2>
        
        <p>Aquí tienes las últimas noticias y actualizaciones:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Artículo Destacado</h3>
            <p>Descripción del artículo principal...</p>
            <a href="#" style="color: #2563eb; text-decoration: none;">Leer más →</a>
        </div>
        
        <h3 style="color: #374151;">Otras Noticias</h3>
        <ul style="padding-left: 20px;">
            <li style="margin-bottom: 10px;"><a href="#" style="color: #2563eb; text-decoration: none;">Noticia 1</a></li>
            <li style="margin-bottom: 10px;"><a href="#" style="color: #2563eb; text-decoration: none;">Noticia 2</a></li>
            <li style="margin-bottom: 10px;"><a href="#" style="color: #2563eb; text-decoration: none;">Noticia 3</a></li>
        </ul>
    </main>
    
    <footer style="background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
            {{company_name}} | {{company_address}}<br>
            <a href="{{unsubscribe_url}}" style="color: #6b7280;">Desuscribirse</a>
        </p>
    </footer>
</body>
</html>`},{id:"promotional",name:"Promocional",description:"Para ofertas y promociones",content:`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">¡Oferta Especial!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Solo para ti, {{nombre}}</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #fef3c7; color: #92400e; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
                50% DE DESCUENTO
            </div>
            <p style="font-size: 18px; margin: 0;">En todos nuestros productos</p>
        </div>
        
        <p>¡Hola {{nombre}}!</p>
        <p>Tenemos una oferta increíble solo para ti. Por tiempo limitado, obtén un 50% de descuento en toda nuestra colección.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">¡COMPRAR AHORA!</a>
        </div>
        
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; text-align: center;">
            <p style="margin: 0; color: #dc2626; font-weight: bold;">⏰ Oferta válida hasta el 31 de diciembre</p>
        </div>
    </div>
    
    <footer style="background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
            {{company_name}} | {{company_address}}<br>
            <a href="{{unsubscribe_url}}" style="color: #6b7280;">Desuscribirse</a>
        </p>
    </footer>
</body>
</html>`}],N=()=>{l.value?a.value&&(a.value.innerHTML=n.html_content):a.value&&(n.html_content=a.value.innerHTML),l.value=!l.value},U=()=>{a.value&&!l.value&&(n.html_content=a.value.innerHTML)},w=o=>{document.execCommand(o)},$=()=>{const o=prompt("Ingresa la URL:");o&&document.execCommand("createLink",!1,o)},A=()=>{const o=prompt("Ingresa la URL de la imagen:");o&&document.execCommand("insertImage",!1,o)},q=()=>{const o=prompt("Ingresa la variable (ej: {{nombre}}):");o&&M(o)},M=o=>{if(l.value){const e=document.querySelector("textarea");if(e){const s=e.selectionStart,k=e.selectionEnd,P=e.value;e.value=P.substring(0,s)+o+P.substring(k),n.html_content=e.value,W(()=>{e.selectionStart=e.selectionEnd=s+o.length,e.focus()})}}else document.execCommand("insertText",!1,o)},S=o=>{},B=()=>{},I=o=>{confirm("¿Reemplazar el contenido actual con esta plantilla?")&&(n.html_content=o.content,a.value&&!l.value&&(a.value.innerHTML=o.content))},O=()=>{g.value=!0},R=async()=>{if(C.value){x.value=!0;try{const o={name:n.name,subject:n.subject,html_content:n.html_content,text_content:n.text_content||null,is_active:n.is_active};if(b.value){const{error:e}=await h.from("email_templates").update(o).eq("id",_.value);if(e)throw e;alert("Plantilla actualizada exitosamente")}else{const{error:e}=await h.from("email_templates").insert([o]);if(e)throw e;alert("Plantilla creada exitosamente"),X("/templates")}}catch(o){console.error("Error guardando plantilla:",o),alert(`Error al guardar la plantilla: ${o.message}`)}finally{x.value=!1}}};return K(async()=>{if(b.value)try{const{data:o,error:e}=await h.from("email_templates").select("*").eq("id",_.value).single();if(e)throw e;o&&(Object.assign(n,o),a.value&&!l.value&&(a.value.innerHTML=o.content))}catch(o){console.error("Error cargando plantilla:",o),alert("Error al cargar la plantilla")}}),(o,e)=>(d(),i("div",ne,[t("div",ae,[t("div",le,[t("div",ie,[t("div",de,[t("button",{onClick:e[0]||(e[0]=s=>o.$router.back()),class:"mr-3 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"},[u(r(ee),{class:"h-5 w-5"})]),t("div",null,[t("h1",ce,p(r(b)?"Editar Plantilla":"Nueva Plantilla HTML"),1),e[13]||(e[13]=t("p",{class:"text-sm text-gray-500 mt-1 hidden sm:block"}," Diseña plantillas HTML reutilizables para tus campañas de email ",-1))])]),t("div",pe,[t("button",{onClick:O,disabled:!r(n).html_content,class:"inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"},[u(r(te),{class:"h-4 w-4 mr-2"}),e[14]||(e[14]=L(" Vista Previa ",-1))],8,ue),t("button",{onClick:R,disabled:!r(C)||r(x),class:"inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"},[u(r(re),{class:"h-4 w-4 mr-2"}),L(" "+p(r(x)?"Guardando...":r(b)?"Actualizar":"Guardar Plantilla"),1)],8,me)])])])]),t("div",be,[t("div",xe,[t("div",ge,[t("div",ye,[e[23]||(e[23]=t("div",{class:"px-4 sm:px-6 py-4 border-b border-gray-200"},[t("h2",{class:"text-lg font-semibold text-gray-900"},"Editor de Plantilla")],-1)),t("div",fe,[t("div",ve,[t("div",null,[e[15]||(e[15]=t("label",{class:"block text-sm font-medium text-gray-700 mb-2"}," Nombre de la Plantilla * ",-1)),c(t("input",{"onUpdate:modelValue":e[1]||(e[1]=s=>r(n).name=s),type:"text",required:"",class:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",placeholder:"Ej: Newsletter Mensual"},null,512),[[m,r(n).name]])])]),t("div",null,[e[16]||(e[16]=t("label",{class:"block text-sm font-medium text-gray-700 mb-2"}," Asunto por Defecto ",-1)),c(t("input",{"onUpdate:modelValue":e[2]||(e[2]=s=>r(n).subject=s),type:"text",class:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",placeholder:"Asunto del email (puede incluir variables como {{nombre}})"},null,512),[[m,r(n).subject]])]),t("div",null,[e[17]||(e[17]=t("label",{class:"block text-sm font-medium text-gray-700 mb-2"}," Descripción ",-1)),c(t("textarea",{"onUpdate:modelValue":e[3]||(e[3]=s=>r(n).description=s),rows:"2",class:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",placeholder:"Descripción breve de la plantilla..."},null,512),[[m,r(n).description]])]),t("div",null,[t("div",{class:"flex justify-between items-center mb-2"},[e[18]||(e[18]=t("label",{class:"block text-sm font-medium text-gray-700"}," Contenido HTML * ",-1)),t("div",{class:"flex space-x-2"},[t("button",{onClick:q,class:"text-sm text-blue-600 hover:text-blue-800"}," Insertar Variable "),t("button",{onClick:B,class:"text-sm text-green-600 hover:text-green-800"}," Plantilla Base ")])]),t("div",he,[t("button",{onClick:e[4]||(e[4]=s=>w("bold")),class:"p-1 rounded hover:bg-gray-200 text-sm font-bold",type:"button"}," B "),t("button",{onClick:e[5]||(e[5]=s=>w("italic")),class:"p-1 rounded hover:bg-gray-200 text-sm italic",type:"button"}," I "),t("button",{onClick:e[6]||(e[6]=s=>w("underline")),class:"p-1 rounded hover:bg-gray-200 text-sm underline",type:"button"}," U "),e[19]||(e[19]=t("div",{class:"border-l border-gray-300 h-6 mx-2"},null,-1)),t("button",{onClick:$,class:"p-1 rounded hover:bg-gray-200 text-sm",type:"button"}," 🔗 "),t("button",{onClick:A,class:"p-1 rounded hover:bg-gray-200 text-sm",type:"button"}," 🖼️ "),e[20]||(e[20]=t("div",{class:"border-l border-gray-300 h-6 mx-2"},null,-1)),t("button",{onClick:N,class:Q([{"bg-blue-100 text-blue-700":r(l)},"px-2 py-1 text-sm rounded hover:bg-gray-200"]),type:"button"},p(r(l)?"Visual":"Código"),3)]),t("div",we,[r(l)?c((d(),i("textarea",{key:1,"onUpdate:modelValue":e[7]||(e[7]=s=>r(n).html_content=s),class:"w-full min-h-[400px] p-4 font-mono text-sm border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",placeholder:"Escribe tu HTML aquí..."},null,512)),[[m,r(n).html_content]]):(d(),i("div",{key:0,ref_key:"visualEditor",ref:a,contenteditable:"true",onInput:U,onKeydown:S,class:"min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",style:{"white-space":"pre-wrap"},innerHTML:r(n).html_content},null,40,ke))])]),t("div",_e,[e[21]||(e[21]=t("h4",{class:"text-sm font-medium text-blue-900 mb-2"},"Variables Disponibles",-1)),t("div",Ce,[(d(),i(D,null,H(T,s=>t("span",{key:s.key,onClick:k=>M(s.key),class:"bg-white px-2 py-1 rounded border cursor-pointer hover:bg-blue-100 transition-colors",title:s.description},p(s.key),9,Ee)),64))]),e[22]||(e[22]=t("p",{class:"text-xs text-blue-700 mt-2"}," Haz clic en una variable para insertarla en el editor ",-1))])])])]),t("div",Te,[t("div",Me,[e[25]||(e[25]=t("div",{class:"px-4 py-3 border-b border-gray-200"},[t("h3",{class:"text-sm font-semibold text-gray-900"},"Vista Previa")],-1)),t("div",Pe,[r(n).html_content?(d(),i("div",{key:0,class:"border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-60 overflow-y-auto text-xs",innerHTML:r(E)},null,8,Le)):(d(),i("div",De,[u(r(oe),{class:"h-8 w-8 mx-auto mb-2 text-gray-400"}),e[24]||(e[24]=t("p",{class:"text-sm"},"La vista previa aparecerá aquí",-1))]))])]),t("div",He,[e[26]||(e[26]=t("div",{class:"px-4 py-3 border-b border-gray-200"},[t("h3",{class:"text-sm font-semibold text-gray-900"},"Plantillas Base")],-1)),t("div",je,[(d(),i(D,null,H(z,s=>t("button",{key:s.id,onClick:k=>I(s),class:"w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"},[t("div",ze,p(s.name),1),t("div",Ne,p(s.description),1)],8,Ve)),64))])]),t("div",Ue,[e[31]||(e[31]=t("div",{class:"px-4 py-3 border-b border-gray-200"},[t("h3",{class:"text-sm font-semibold text-gray-900"},"Configuración")],-1)),t("div",$e,[t("label",Ae,[c(t("input",{"onUpdate:modelValue":e[8]||(e[8]=s=>r(n).is_active=s),type:"checkbox",class:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"},null,512),[[j,r(n).is_active]]),e[27]||(e[27]=t("span",{class:"ml-2 text-sm text-gray-700"},"Plantilla activa",-1))]),t("label",qe,[c(t("input",{"onUpdate:modelValue":e[9]||(e[9]=s=>r(n).is_default=s),type:"checkbox",class:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"},null,512),[[j,r(n).is_default]]),e[28]||(e[28]=t("span",{class:"ml-2 text-sm text-gray-700"},"Plantilla por defecto",-1))]),t("div",null,[e[29]||(e[29]=t("label",{class:"block text-sm font-medium text-gray-700 mb-1"}," Etiquetas ",-1)),c(t("input",{"onUpdate:modelValue":e[10]||(e[10]=s=>r(n).tags=s),type:"text",class:"w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"newsletter, promocional"},null,512),[[m,r(n).tags]]),e[30]||(e[30]=t("p",{class:"text-xs text-gray-500 mt-1"},"Separar con comas",-1))])])])])])]),r(g)?(d(),i("div",Se,[t("div",Be,[t("div",Ie,[e[32]||(e[32]=t("h3",{class:"text-lg font-medium text-gray-900"},"Vista Previa de la Plantilla",-1)),t("button",{onClick:e[11]||(e[11]=s=>g.value=!1),class:"text-gray-400 hover:text-gray-600"},[u(r(se),{class:"h-6 w-6"})])]),t("div",Oe,[t("div",{innerHTML:r(E)},null,8,Re)]),t("div",Fe,[t("button",{onClick:e[12]||(e[12]=s=>g.value=!1),class:"px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400"}," Cerrar ")])])])):J("",!0)]))}});export{Ze as default};
