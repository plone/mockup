(function(window,undefined){function require(arg){return window.less[arg.split("/")[1]]}if(!Array.isArray){Array.isArray=function(obj){return Object.prototype.toString.call(obj)==="[object Array]"||obj instanceof Array}}if(!Array.prototype.forEach){Array.prototype.forEach=function(block,thisObject){var len=this.length>>>0;for(var i=0;i<len;i++){if(i in this){block.call(thisObject,this[i],i,this)}}}}if(!Array.prototype.map){Array.prototype.map=function(fun){var len=this.length>>>0;var res=new Array(len);var thisp=arguments[1];for(var i=0;i<len;i++){if(i in this){res[i]=fun.call(thisp,this[i],i,this)}}return res}}if(!Array.prototype.filter){Array.prototype.filter=function(block){var values=[];var thisp=arguments[1];for(var i=0;i<this.length;i++){if(block.call(thisp,this[i])){values.push(this[i])}}return values}}if(!Array.prototype.reduce){Array.prototype.reduce=function(fun){var len=this.length>>>0;var i=0;if(len===0&&arguments.length===1)throw new TypeError;if(arguments.length>=2){var rv=arguments[1]}else{do{if(i in this){rv=this[i++];break}if(++i>=len)throw new TypeError}while(true)}for(;i<len;i++){if(i in this){rv=fun.call(null,rv,this[i],i,this)}}return rv}}if(!Array.prototype.indexOf){Array.prototype.indexOf=function(value){var length=this.length;var i=arguments[1]||0;if(!length)return-1;if(i>=length)return-1;if(i<0)i+=length;for(;i<length;i++){if(!Object.prototype.hasOwnProperty.call(this,i)){continue}if(value===this[i])return i}return-1}}if(!Object.keys){Object.keys=function(object){var keys=[];for(var name in object){if(Object.prototype.hasOwnProperty.call(object,name)){keys.push(name)}}return keys}}if(!String.prototype.trim){String.prototype.trim=function(){return String(this).replace(/^\s\s*/,"").replace(/\s\s*$/,"")}}var less,tree,charset;if(typeof environment==="object"&&{}.toString.call(environment)==="[object Environment]"){if(typeof window==="undefined"){less={}}else{less=window.less={}}tree=less.tree={};less.mode="rhino"}else if(typeof window==="undefined"){less=exports,tree=require("./tree");less.mode="node"}else{if(typeof window.less==="undefined"){window.less={}}less=window.less,tree=window.less.tree={};less.mode="browser"}less.Parser=function Parser(env){var input,i,j,temp,memo,furthest,chunks,current,parser;var that=this;var env=env||{};if(!env.contents){env.contents={}}env.rootpath=env.rootpath||"";if(!env.files){env.files={}}var finish=function(){};var imports=this.imports={paths:env.paths||[],queue:[],files:env.files,contents:env.contents,mime:env.mime,error:null,push:function(path,callback){var that=this;this.queue.push(path);less.Parser.importer(path,this.paths,function(e,root,fullPath){that.queue.splice(that.queue.indexOf(path),1);var imported=fullPath in that.files;that.files[fullPath]=root;if(e&&!that.error){that.error=e}callback(e,root,imported);if(that.queue.length===0){finish(that.error)}},env)}};function save(){temp=chunks[j],memo=i,current=i}function restore(){chunks[j]=temp,i=memo,current=i}function sync(){if(i>current){chunks[j]=chunks[j].slice(i-current);current=i}}function isWhitespace(c){var code=c.charCodeAt(0);return code===32||code===10||code===9}function $(tok){var match,args,length,index,k;if(tok instanceof Function){return tok.call(parser.parsers)}else if(typeof tok==="string"){match=input.charAt(i)===tok?tok:null;length=1;sync()}else{sync();if(match=tok.exec(chunks[j])){length=match[0].length}else{return null}}if(match){skipWhitespace(length);if(typeof match==="string"){return match}else{return match.length===1?match[0]:match}}}function skipWhitespace(length){var oldi=i,oldj=j,endIndex=i+chunks[j].length,mem=i+=length;while(i<endIndex){if(!isWhitespace(input.charAt(i))){break}i++}chunks[j]=chunks[j].slice(length+(i-mem));current=i;if(chunks[j].length===0&&j<chunks.length-1){j++}return oldi!==i||oldj!==j}function expect(arg,msg){var result=$(arg);if(!result){error(msg||(typeof arg==="string"?"expected '"+arg+"' got '"+input.charAt(i)+"'":"unexpected token"))}else{return result}}function error(msg,type){var e=new Error(msg);e.index=i;e.type=type||"Syntax";throw e}function peek(tok){if(typeof tok==="string"){return input.charAt(i)===tok}else{if(tok.test(chunks[j])){return true}else{return false}}}function getInput(e,env){if(e.filename&&env.filename&&e.filename!==env.filename){return parser.imports.contents[e.filename]}else{return input}}function getLocation(index,input){for(var n=index,column=-1;n>=0&&input.charAt(n)!=="\n";n--){column++}return{line:typeof index==="number"?(input.slice(0,index).match(/\n/g)||"").length:null,column:column}}function getFileName(e){if(less.mode==="browser"||less.mode==="rhino")return e.filename;else return require("path").resolve(e.filename)}function getDebugInfo(index,inputStream,e){return{lineNumber:getLocation(index,inputStream).line+1,fileName:getFileName(e)}}function LessError(e,env){var input=getInput(e,env),loc=getLocation(e.index,input),line=loc.line,col=loc.column,lines=input.split("\n");this.type=e.type||"Syntax";this.message=e.message;this.filename=e.filename||env.filename;this.index=e.index;this.line=typeof line==="number"?line+1:null;this.callLine=e.call&&getLocation(e.call,input).line+1;this.callExtract=lines[getLocation(e.call,input).line];this.stack=e.stack;this.column=col;this.extract=[lines[line-1],lines[line],lines[line+1]]}this.env=env=env||{};this.optimization="optimization"in this.env?this.env.optimization:1;this.env.filename=this.env.filename||null;return parser={imports:imports,parse:function(str,callback){var root,start,end,zone,line,lines,buff=[],c,error=null;i=j=current=furthest=0;input=str.replace(/\r\n/g,"\n");input=input.replace(/^\uFEFF/,"");chunks=function(chunks){var j=0,skip=/(?:@\{[\w-]+\}|[^"'`\{\}\/\(\)\\])+/g,comment=/\/\*(?:[^*]|\*+[^\/*])*\*+\/|\/\/.*/g,string=/"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'|`((?:[^`]|\\.)*)`/g,level=0,match,chunk=chunks[0],inParam;for(var i=0,c,cc;i<input.length;){skip.lastIndex=i;if(match=skip.exec(input)){if(match.index===i){i+=match[0].length;chunk.push(match[0])}}c=input.charAt(i);comment.lastIndex=string.lastIndex=i;if(match=string.exec(input)){if(match.index===i){i+=match[0].length;chunk.push(match[0]);continue}}if(!inParam&&c==="/"){cc=input.charAt(i+1);if(cc==="/"||cc==="*"){if(match=comment.exec(input)){if(match.index===i){i+=match[0].length;chunk.push(match[0]);continue}}}}switch(c){case"{":if(!inParam){level++;chunk.push(c);break}case"}":if(!inParam){level--;chunk.push(c);chunks[++j]=chunk=[];break}case"(":if(!inParam){inParam=true;chunk.push(c);break}case")":if(inParam){inParam=false;chunk.push(c);break}default:chunk.push(c)}i++}if(level!=0){error=new LessError({index:i-1,type:"Parse",message:level>0?"missing closing `}`":"missing opening `{`",filename:env.filename},env)}return chunks.map(function(c){return c.join("")})}([[]]);if(error){return callback(error,env)}try{root=new tree.Ruleset([],$(this.parsers.primary));root.root=true}catch(e){return callback(new LessError(e,env))}root.toCSS=function(evaluate){var line,lines,column;return function(options,variables){var frames=[],importError;options=options||{};if(typeof variables==="object"&&!Array.isArray(variables)){variables=Object.keys(variables).map(function(k){var value=variables[k];if(!(value instanceof tree.Value)){if(!(value instanceof tree.Expression)){value=new tree.Expression([value])}value=new tree.Value([value])}return new tree.Rule("@"+k,value,false,0)});frames=[new tree.Ruleset(null,variables)]}try{var css=evaluate.call(this,{frames:frames}).toCSS([],{compress:options.compress||false,dumpLineNumbers:env.dumpLineNumbers})}catch(e){throw new LessError(e,env)}if(importError=parser.imports.error){if(importError instanceof LessError)throw importError;else throw new LessError(importError,env)}if(options.yuicompress&&less.mode==="node"){return require("ycssmin").cssmin(css)}else if(options.compress){return css.replace(/(\s)+/g,"$1")}else{return css}}}(root.eval);if(i<input.length-1){i=furthest;lines=input.split("\n");line=(input.slice(0,i).match(/\n/g)||"").length+1;for(var n=i,column=-1;n>=0&&input.charAt(n)!=="\n";n--){column++}error={type:"Parse",message:"Syntax Error on line "+line,index:i,filename:env.filename,line:line,column:column,extract:[lines[line-2],lines[line-1],lines[line]]}}if(this.imports.queue.length>0){finish=function(e){e=error||e;if(e)callback(e);else callback(null,root)}}else{callback(error,root)}},parsers:{primary:function(){var node,root=[];while((node=$(this.mixin.definition)||$(this.rule)||$(this.ruleset)||$(this.mixin.call)||$(this.comment)||$(this.directive))||$(/^[\s\n]+/)||$(/^;+/)){node&&root.push(node)}return root},comment:function(){var comment;if(input.charAt(i)!=="/")return;if(input.charAt(i+1)==="/"){return new tree.Comment($(/^\/\/.*/),true)}else if(comment=$(/^\/\*(?:[^*]|\*+[^\/*])*\*+\/\n?/)){return new tree.Comment(comment)}},entities:{quoted:function(){var str,j=i,e;if(input.charAt(j)==="~"){j++,e=true}if(input.charAt(j)!=='"'&&input.charAt(j)!=="'")return;e&&$("~");if(str=$(/^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/)){return new tree.Quoted(str[0],str[1]||str[2],e)}},keyword:function(){var k;if(k=$(/^[_A-Za-z-][_A-Za-z0-9-]*/)){if(tree.colors.hasOwnProperty(k)){return new tree.Color(tree.colors[k].slice(1))}else{return new tree.Keyword(k)}}},call:function(){var name,nameLC,args,alpha_ret,index=i;if(!(name=/^([\w-]+|%|progid:[\w\.]+)\(/.exec(chunks[j])))return;name=name[1];nameLC=name.toLowerCase();if(nameLC==="url"){return null}else{i+=name.length}if(nameLC==="alpha"){alpha_ret=$(this.alpha);if(typeof alpha_ret!=="undefined"){return alpha_ret}}$("(");args=$(this.entities.arguments);if(!$(")"))return;if(name){return new tree.Call(name,args,index,env.filename)}},arguments:function(){var args=[],arg;while(arg=$(this.entities.assignment)||$(this.expression)){args.push(arg);if(!$(",")){break}}return args},literal:function(){return $(this.entities.ratio)||$(this.entities.dimension)||$(this.entities.color)||$(this.entities.quoted)||$(this.entities.unicodeDescriptor)},assignment:function(){var key,value;if((key=$(/^\w+(?=\s?=)/i))&&$("=")&&(value=$(this.entity))){return new tree.Assignment(key,value)}},url:function(){var value;if(input.charAt(i)!=="u"||!$(/^url\(/))return;value=$(this.entities.quoted)||$(this.entities.variable)||$(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/)||"";expect(")");return new tree.URL(value.value!=null||value instanceof tree.Variable?value:new tree.Anonymous(value),env.rootpath)},variable:function(){var name,index=i;if(input.charAt(i)==="@"&&(name=$(/^@@?[\w-]+/))){return new tree.Variable(name,index,env.filename)}},variableCurly:function(){var name,curly,index=i;if(input.charAt(i)==="@"&&(curly=$(/^@\{([\w-]+)\}/))){return new tree.Variable("@"+curly[1],index,env.filename)}},color:function(){var rgb;if(input.charAt(i)==="#"&&(rgb=$(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))){return new tree.Color(rgb[1])}},dimension:function(){var value,c=input.charCodeAt(i);if(c>57||c<43||c===47||c==44)return;if(value=$(/^([+-]?\d*\.?\d+)(px|%|em|pc|ex|in|deg|s|ms|pt|cm|mm|rad|grad|turn|dpi|dpcm|dppx|rem|vw|vh|vmin|vm|ch)?/)){return new tree.Dimension(value[1],value[2])}},ratio:function(){var value,c=input.charCodeAt(i);if(c>57||c<48)return;if(value=$(/^(\d+\/\d+)/)){return new tree.Ratio(value[1])}},unicodeDescriptor:function(){var ud;if(ud=$(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/)){return new tree.UnicodeDescriptor(ud[0])}},javascript:function(){var str,j=i,e;if(input.charAt(j)==="~"){j++,e=true}if(input.charAt(j)!=="`"){return}e&&$("~");if(str=$(/^`([^`]*)`/)){return new tree.JavaScript(str[1],i,e)}}},variable:function(){var name;if(input.charAt(i)==="@"&&(name=$(/^(@[\w-]+)\s*:/))){return name[1]}},shorthand:function(){var a,b;if(!peek(/^[@\w.%-]+\/[@\w.-]+/))return;save();if((a=$(this.entity))&&$("/")&&(b=$(this.entity))){return new tree.Shorthand(a,b)}restore()},mixin:{call:function(){var elements=[],e,c,argsSemiColon=[],argsComma=[],args,delim,arg,nameLoop,expressions,isSemiColonSeperated,expressionContainsNamed,index=i,s=input.charAt(i),name,value,important=false;if(s!=="."&&s!=="#"){return}save();while(e=$(/^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/)){elements.push(new tree.Element(c,e,i));c=$(">")}if($("(")){expressions=[];while(arg=$(this.expression)){nameLoop=null;value=arg;if(arg.value.length==1){var val=arg.value[0];if(val instanceof tree.Variable){if($(":")){if(expressions.length>0){if(isSemiColonSeperated){error("Cannot mix ; and , as delimiter types")}expressionContainsNamed=true}value=expect(this.expression);nameLoop=name=val.name}}}expressions.push(value);argsComma.push({name:nameLoop,value:value});if($(",")){continue}if($(";")||isSemiColonSeperated){if(expressionContainsNamed){error("Cannot mix ; and , as delimiter types")}isSemiColonSeperated=true;if(expressions.length>1){value=new tree.Value(expressions)}argsSemiColon.push({name:name,value:value});name=null;expressions=[];expressionContainsNamed=false}}expect(")")}args=isSemiColonSeperated?argsSemiColon:argsComma;if($(this.important)){important=true}if(elements.length>0&&($(";")||peek("}"))){return new tree.mixin.Call(elements,args,index,env.filename,important)}restore()},definition:function(){var name,params=[],match,ruleset,param,value,cond,variadic=false;if(input.charAt(i)!=="."&&input.charAt(i)!=="#"||peek(/^[^{]*\}/))return;save();if(match=$(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/)){name=match[1];do{$(this.comment);if(input.charAt(i)==="."&&$(/^\.{3}/)){variadic=true;params.push({variadic:true});break}else if(param=$(this.entities.variable)||$(this.entities.literal)||$(this.entities.keyword)){if(param instanceof tree.Variable){if($(":")){value=expect(this.expression,"expected expression");params.push({name:param.name,value:value})}else if($(/^\.{3}/)){params.push({name:param.name,variadic:true});variadic=true;break}else{params.push({name:param.name})}}else{params.push({value:param})}}else{break}}while($(",")||$(";"));if(!$(")")){furthest=i;restore()}$(this.comment);if($(/^when/)){cond=expect(this.conditions,"expected condition")}ruleset=$(this.block);if(ruleset){return new tree.mixin.Definition(name,params,ruleset,cond,variadic)}else{restore()}}}},entity:function(){return $(this.entities.literal)||$(this.entities.variable)||$(this.entities.url)||$(this.entities.call)||$(this.entities.keyword)||$(this.entities.javascript)||$(this.comment)},end:function(){return $(";")||peek("}")},alpha:function(){var value;if(!$(/^\(opacity=/i))return;if(value=$(/^\d+/)||$(this.entities.variable)){expect(")");return new tree.Alpha(value)}},element:function(){var e,t,c,v;c=$(this.combinator);e=$(/^(?:\d+\.\d+|\d+)%/)||$(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/)||$("*")||$("&")||$(this.attribute)||$(/^\([^()@]+\)/)||$(/^[\.#](?=@)/)||$(this.entities.variableCurly);if(!e){if($("(")){if((v=$(this.entities.variableCurly)||$(this.entities.variable)||$(this.selector))&&$(")")){e=new tree.Paren(v)}}}if(e){return new tree.Element(c,e,i)}},combinator:function(){var match,c=input.charAt(i);if(c===">"||c==="+"||c==="~"||c==="|"){i++;while(input.charAt(i).match(/\s/)){i++}return new tree.Combinator(c)}else if(input.charAt(i-1).match(/\s/)){return new tree.Combinator(" ")}else{return new tree.Combinator(null)}},selector:function(){var sel,e,elements=[],c,match;if($("(")){sel=$(this.entity);if(!$(")")){return null}return new tree.Selector([new tree.Element("",sel,i)])}while(e=$(this.element)){c=input.charAt(i);elements.push(e);if(c==="{"||c==="}"||c===";"||c===","||c===")"){break}}if(elements.length>0){return new tree.Selector(elements)}},attribute:function(){var attr="",key,val,op;if(!$("["))return;if(key=$(/^(?:[_A-Za-z0-9-]|\\.)+/)||$(this.entities.quoted)){if((op=$(/^[|~*$^]?=/))&&(val=$(this.entities.quoted)||$(/^[\w-]+/))){attr=[key,op,val.toCSS?val.toCSS():val].join("")}else{attr=key}}if(!$("]"))return;if(attr){return"["+attr+"]"}},block:function(){var content;if($("{")&&(content=$(this.primary))&&$("}")){return content}},ruleset:function(){var selectors=[],s,rules,match,debugInfo;save();if(env.dumpLineNumbers)debugInfo=getDebugInfo(i,input,env);while(s=$(this.selector)){selectors.push(s);$(this.comment);if(!$(",")){break}$(this.comment)}if(selectors.length>0&&(rules=$(this.block))){var ruleset=new tree.Ruleset(selectors,rules,env.strictImports);if(env.dumpLineNumbers)ruleset.debugInfo=debugInfo;return ruleset}else{furthest=i;restore()}},rule:function(){var name,value,c=input.charAt(i),important,match;save();if(c==="."||c==="#"||c==="&"){return}if(name=$(this.variable)||$(this.property)){if(name.charAt(0)!="@"&&(match=/^([^@+\/'"*`(;{}-]*);/.exec(chunks[j]))){i+=match[0].length-1;value=new tree.Anonymous(match[1])}else if(name==="font"){value=$(this.font)}else{value=$(this.value)}important=$(this.important);if(value&&$(this.end)){return new tree.Rule(name,value,important,memo)}else{furthest=i;restore()}}},"import":function(){var path,features,index=i;save();var dir=$(/^@import(?:-(once))?\s+/);if(dir&&(path=$(this.entities.quoted)||$(this.entities.url))){features=$(this.mediaFeatures);if($(";")){return new tree.Import(path,imports,features,dir[1]==="once",index,env.rootpath)}}restore()},mediaFeature:function(){var e,p,nodes=[];do{if(e=$(this.entities.keyword)){nodes.push(e)}else if($("(")){p=$(this.property);e=$(this.entity);if($(")")){if(p&&e){nodes.push(new tree.Paren(new tree.Rule(p,e,null,i,true)))}else if(e){nodes.push(new tree.Paren(e))}else{return null}}else{return null}}}while(e);if(nodes.length>0){return new tree.Expression(nodes)}},mediaFeatures:function(){var e,features=[];do{if(e=$(this.mediaFeature)){features.push(e);if(!$(",")){break}}else if(e=$(this.entities.variable)){features.push(e);if(!$(",")){break}}}while(e);return features.length>0?features:null},media:function(){var features,rules,media,debugInfo;if(env.dumpLineNumbers)debugInfo=getDebugInfo(i,input,env);if($(/^@media/)){features=$(this.mediaFeatures);if(rules=$(this.block)){media=new tree.Media(rules,features);if(env.dumpLineNumbers)media.debugInfo=debugInfo;return media}}},directive:function(){var name,value,rules,identifier,e,nodes,nonVendorSpecificName,hasBlock,hasIdentifier,hasExpression;if(input.charAt(i)!=="@")return;if(value=$(this["import"])||$(this.media)){return value}save();name=$(/^@[a-z-]+/);if(!name)return;nonVendorSpecificName=name;if(name.charAt(1)=="-"&&name.indexOf("-",2)>0){nonVendorSpecificName="@"+name.slice(name.indexOf("-",2)+1)}switch(nonVendorSpecificName){case"@font-face":hasBlock=true;break;case"@viewport":case"@top-left":case"@top-left-corner":case"@top-center":case"@top-right":case"@top-right-corner":case"@bottom-left":case"@bottom-left-corner":case"@bottom-center":case"@bottom-right":case"@bottom-right-corner":case"@left-top":case"@left-middle":case"@left-bottom":case"@right-top":case"@right-middle":case"@right-bottom":hasBlock=true;break;case"@page":case"@document":case"@supports":case"@keyframes":hasBlock=true;hasIdentifier=true;break;case"@namespace":hasExpression=true;break}if(hasIdentifier){name+=" "+($(/^[^{]+/)||"").trim()}if(hasBlock){if(rules=$(this.block)){return new tree.Directive(name,rules)}}else{if((value=hasExpression?$(this.expression):$(this.entity))&&$(";")){var directive=new tree.Directive(name,value);if(env.dumpLineNumbers){directive.debugInfo=getDebugInfo(i,input,env)}return directive}}restore()},font:function(){var value=[],expression=[],weight,shorthand,font,e;while(e=$(this.shorthand)||$(this.entity)){expression.push(e)}value.push(new tree.Expression(expression));if($(",")){while(e=$(this.expression)){value.push(e);if(!$(",")){break}}}return new tree.Value(value)},value:function(){var e,expressions=[],important;while(e=$(this.expression)){expressions.push(e);if(!$(",")){break}}if(expressions.length>0){return new tree.Value(expressions)}},important:function(){if(input.charAt(i)==="!"){return $(/^! *important/)}},sub:function(){var e;if($("(")&&(e=$(this.expression))&&$(")")){return e}},multiplication:function(){var m,a,op,operation;if(m=$(this.operand)){while(!peek(/^\/[*\/]/)&&(op=$("/")||$("*"))&&(a=$(this.operand))){operation=new tree.Operation(op,[operation||m,a])}return operation||m}},addition:function(){var m,a,op,operation;if(m=$(this.multiplication)){while((op=$(/^[-+]\s+/)||!isWhitespace(input.charAt(i-1))&&($("+")||$("-")))&&(a=$(this.multiplication))){operation=new tree.Operation(op,[operation||m,a])}return operation||m}},conditions:function(){var a,b,index=i,condition;if(a=$(this.condition)){while($(",")&&(b=$(this.condition))){condition=new tree.Condition("or",condition||a,b,index)}return condition||a}},condition:function(){var a,b,c,op,index=i,negate=false;if($(/^not/)){negate=true}expect("(");if(a=$(this.addition)||$(this.entities.keyword)||$(this.entities.quoted)){if(op=$(/^(?:>=|=<|[<=>])/)){if(b=$(this.addition)||$(this.entities.keyword)||$(this.entities.quoted)){c=new tree.Condition(op,a,b,index,negate)}else{error("expected expression")}}else{c=new tree.Condition("=",a,new tree.Keyword("true"),index,negate)}expect(")");return $(/^and/)?new tree.Condition("and",c,$(this.condition)):c}},operand:function(){var negate,p=input.charAt(i+1);if(input.charAt(i)==="-"&&(p==="@"||p==="(")){negate=$("-")}var o=$(this.sub)||$(this.entities.dimension)||$(this.entities.color)||$(this.entities.variable)||$(this.entities.call);return negate?new tree.Operation("*",[new tree.Dimension(-1),o]):o},expression:function(){var e,delim,entities=[],d;while(e=$(this.addition)||$(this.entity)){entities.push(e)}if(entities.length>0){return new tree.Expression(entities)}},property:function(){var name;if(name=$(/^(\*?-?[_a-z0-9-]+)\s*:/)){return name[1]}}}}};if(less.mode==="browser"||less.mode==="rhino"){less.Parser.importer=function(path,paths,callback,env){if(!/^([a-z-]+:)?\//.test(path)&&paths.length>0){path=paths[0]+path}loadStyleSheet({href:path,title:path,type:env.mime,contents:env.contents,files:env.files,rootpath:env.rootpath,entryPath:env.entryPath,relativeUrls:env.relativeUrls},function(e,root,data,sheet,_,path){if(e&&typeof env.errback==="function"){env.errback.call(null,path,paths,callback,env)}else{callback.call(null,e,root,path)}},true)}}(function(tree){tree.functions={rgb:function(r,g,b){return this.rgba(r,g,b,1)},rgba:function(r,g,b,a){var rgb=[r,g,b].map(function(c){return scaled(c,256)});a=number(a);return new tree.Color(rgb,a)},hsl:function(h,s,l){return this.hsla(h,s,l,1)},hsla:function(h,s,l,a){h=number(h)%360/360;s=number(s);l=number(l);a=number(a);var m2=l<=.5?l*(s+1):l+s-l*s;var m1=l*2-m2;return this.rgba(hue(h+1/3)*255,hue(h)*255,hue(h-1/3)*255,a);function hue(h){h=h<0?h+1:h>1?h-1:h;if(h*6<1)return m1+(m2-m1)*h*6;else if(h*2<1)return m2;else if(h*3<2)return m1+(m2-m1)*(2/3-h)*6;else return m1}},hsv:function(h,s,v){return this.hsva(h,s,v,1)},hsva:function(h,s,v,a){h=number(h)%360/360*360;s=number(s);v=number(v);a=number(a);var i,f;i=Math.floor(h/60%6);f=h/60-i;var vs=[v,v*(1-s),v*(1-f*s),v*(1-(1-f)*s)];var perm=[[0,3,1],[2,0,1],[1,0,3],[1,2,0],[3,1,0],[0,1,2]];return this.rgba(vs[perm[i][0]]*255,vs[perm[i][1]]*255,vs[perm[i][2]]*255,a)},hue:function(color){return new tree.Dimension(Math.round(color.toHSL().h))},saturation:function(color){return new tree.Dimension(Math.round(color.toHSL().s*100),"%")},lightness:function(color){return new tree.Dimension(Math.round(color.toHSL().l*100),"%")},red:function(color){return new tree.Dimension(color.rgb[0])},green:function(color){return new tree.Dimension(color.rgb[1])},blue:function(color){return new tree.Dimension(color.rgb[2])},alpha:function(color){return new tree.Dimension(color.toHSL().a)},luma:function(color){return new tree.Dimension(Math.round((.2126*(color.rgb[0]/255)+.7152*(color.rgb[1]/255)+.0722*(color.rgb[2]/255))*color.alpha*100),"%")},saturate:function(color,amount){var hsl=color.toHSL();hsl.s+=amount.value/100;hsl.s=clamp(hsl.s);return hsla(hsl)},desaturate:function(color,amount){var hsl=color.toHSL();hsl.s-=amount.value/100;hsl.s=clamp(hsl.s);return hsla(hsl)},lighten:function(color,amount){var hsl=color.toHSL();hsl.l+=amount.value/100;hsl.l=clamp(hsl.l);return hsla(hsl)},darken:function(color,amount){var hsl=color.toHSL();hsl.l-=amount.value/100;hsl.l=clamp(hsl.l);return hsla(hsl)},fadein:function(color,amount){var hsl=color.toHSL();hsl.a+=amount.value/100;hsl.a=clamp(hsl.a);return hsla(hsl)},fadeout:function(color,amount){var hsl=color.toHSL();hsl.a-=amount.value/100;hsl.a=clamp(hsl.a);return hsla(hsl)},fade:function(color,amount){var hsl=color.toHSL();hsl.a=amount.value/100;hsl.a=clamp(hsl.a);return hsla(hsl)},spin:function(color,amount){var hsl=color.toHSL();var hue=(hsl.h+amount.value)%360;hsl.h=hue<0?360+hue:hue;return hsla(hsl)},mix:function(color1,color2,weight){if(!weight){weight=new tree.Dimension(50)}var p=weight.value/100;var w=p*2-1;var a=color1.toHSL().a-color2.toHSL().a;var w1=((w*a==-1?w:(w+a)/(1+w*a))+1)/2;var w2=1-w1;var rgb=[color1.rgb[0]*w1+color2.rgb[0]*w2,color1.rgb[1]*w1+color2.rgb[1]*w2,color1.rgb[2]*w1+color2.rgb[2]*w2];var alpha=color1.alpha*p+color2.alpha*(1-p);return new tree.Color(rgb,alpha)},greyscale:function(color){return this.desaturate(color,new tree.Dimension(100))},contrast:function(color,dark,light,threshold){if(!color.rgb){return null}if(typeof light==="undefined"){light=this.rgba(255,255,255,1)}if(typeof dark==="undefined"){dark=this.rgba(0,0,0,1)}if(typeof threshold==="undefined"){threshold=.43}else{threshold=threshold.value}if((.2126*(color.rgb[0]/255)+.7152*(color.rgb[1]/255)+.0722*(color.rgb[2]/255))*color.alpha<threshold){return light}else{return dark}},e:function(str){return new tree.Anonymous(str instanceof tree.JavaScript?str.evaluated:str)},escape:function(str){return new tree.Anonymous(encodeURI(str.value).replace(/=/g,"%3D").replace(/:/g,"%3A").replace(/#/g,"%23").replace(/;/g,"%3B").replace(/\(/g,"%28").replace(/\)/g,"%29"))},"%":function(quoted){var args=Array.prototype.slice.call(arguments,1),str=quoted.value;for(var i=0;i<args.length;i++){str=str.replace(/%[sda]/i,function(token){var value=token.match(/s/i)?args[i].value:args[i].toCSS();return token.match(/[A-Z]$/)?encodeURIComponent(value):value})}str=str.replace(/%%/g,"%");return new tree.Quoted('"'+str+'"',str)},unit:function(val,unit){return new tree.Dimension(val.value,unit?unit.toCSS():"")},round:function(n,f){var fraction=typeof f==="undefined"?0:f.value;return this._math(function(num){return num.toFixed(fraction)},n)},ceil:function(n){return this._math(Math.ceil,n)},floor:function(n){return this._math(Math.floor,n)},_math:function(fn,n){if(n instanceof tree.Dimension){return new tree.Dimension(fn(parseFloat(n.value)),n.unit)}else if(typeof n==="number"){return fn(n)}else{throw{type:"Argument",message:"argument must be a number"}}},argb:function(color){return new tree.Anonymous(color.toARGB())},percentage:function(n){return new tree.Dimension(n.value*100,"%")},color:function(n){if(n instanceof tree.Quoted){return new tree.Color(n.value.slice(1))}else{throw{type:"Argument",message:"argument must be a string"}}},iscolor:function(n){return this._isa(n,tree.Color)},isnumber:function(n){return this._isa(n,tree.Dimension)},isstring:function(n){return this._isa(n,tree.Quoted)},iskeyword:function(n){return this._isa(n,tree.Keyword)},isurl:function(n){return this._isa(n,tree.URL)},ispixel:function(n){return n instanceof tree.Dimension&&n.unit==="px"?tree.True:tree.False},ispercentage:function(n){return n instanceof tree.Dimension&&n.unit==="%"?tree.True:tree.False},isem:function(n){return n instanceof tree.Dimension&&n.unit==="em"?tree.True:tree.False},_isa:function(n,Type){return n instanceof Type?tree.True:tree.False},multiply:function(color1,color2){var r=color1.rgb[0]*color2.rgb[0]/255;var g=color1.rgb[1]*color2.rgb[1]/255;var b=color1.rgb[2]*color2.rgb[2]/255;return this.rgb(r,g,b)},screen:function(color1,color2){var r=255-(255-color1.rgb[0])*(255-color2.rgb[0])/255;var g=255-(255-color1.rgb[1])*(255-color2.rgb[1])/255;var b=255-(255-color1.rgb[2])*(255-color2.rgb[2])/255;return this.rgb(r,g,b)},overlay:function(color1,color2){var r=color1.rgb[0]<128?2*color1.rgb[0]*color2.rgb[0]/255:255-2*(255-color1.rgb[0])*(255-color2.rgb[0])/255;var g=color1.rgb[1]<128?2*color1.rgb[1]*color2.rgb[1]/255:255-2*(255-color1.rgb[1])*(255-color2.rgb[1])/255;var b=color1.rgb[2]<128?2*color1.rgb[2]*color2.rgb[2]/255:255-2*(255-color1.rgb[2])*(255-color2.rgb[2])/255;return this.rgb(r,g,b)},softlight:function(color1,color2){var t=color2.rgb[0]*color1.rgb[0]/255;var r=t+color1.rgb[0]*(255-(255-color1.rgb[0])*(255-color2.rgb[0])/255-t)/255;t=color2.rgb[1]*color1.rgb[1]/255;var g=t+color1.rgb[1]*(255-(255-color1.rgb[1])*(255-color2.rgb[1])/255-t)/255;t=color2.rgb[2]*color1.rgb[2]/255;var b=t+color1.rgb[2]*(255-(255-color1.rgb[2])*(255-color2.rgb[2])/255-t)/255;return this.rgb(r,g,b)},hardlight:function(color1,color2){var r=color2.rgb[0]<128?2*color2.rgb[0]*color1.rgb[0]/255:255-2*(255-color2.rgb[0])*(255-color1.rgb[0])/255;var g=color2.rgb[1]<128?2*color2.rgb[1]*color1.rgb[1]/255:255-2*(255-color2.rgb[1])*(255-color1.rgb[1])/255;var b=color2.rgb[2]<128?2*color2.rgb[2]*color1.rgb[2]/255:255-2*(255-color2.rgb[2])*(255-color1.rgb[2])/255;return this.rgb(r,g,b)},difference:function(color1,color2){var r=Math.abs(color1.rgb[0]-color2.rgb[0]);var g=Math.abs(color1.rgb[1]-color2.rgb[1]);var b=Math.abs(color1.rgb[2]-color2.rgb[2]);return this.rgb(r,g,b)},exclusion:function(color1,color2){var r=color1.rgb[0]+color2.rgb[0]*(255-color1.rgb[0]-color1.rgb[0])/255;var g=color1.rgb[1]+color2.rgb[1]*(255-color1.rgb[1]-color1.rgb[1])/255;var b=color1.rgb[2]+color2.rgb[2]*(255-color1.rgb[2]-color1.rgb[2])/255;return this.rgb(r,g,b)},average:function(color1,color2){var r=(color1.rgb[0]+color2.rgb[0])/2;var g=(color1.rgb[1]+color2.rgb[1])/2;var b=(color1.rgb[2]+color2.rgb[2])/2;return this.rgb(r,g,b)},negation:function(color1,color2){var r=255-Math.abs(255-color2.rgb[0]-color1.rgb[0]);var g=255-Math.abs(255-color2.rgb[1]-color1.rgb[1]);var b=255-Math.abs(255-color2.rgb[2]-color1.rgb[2]);return this.rgb(r,g,b)},tint:function(color,amount){return this.mix(this.rgb(255,255,255),color,amount)},shade:function(color,amount){return this.mix(this.rgb(0,0,0),color,amount)}};function hsla(color){return tree.functions.hsla(color.h,color.s,color.l,color.a)}function scaled(n,size){if(n instanceof tree.Dimension&&n.unit=="%"){return parseFloat(n.value*size/100)}else{return number(n)}}function number(n){if(n instanceof tree.Dimension){return parseFloat(n.unit=="%"?n.value/100:n.value)}else if(typeof n==="number"){return n}else{throw{error:"RuntimeError",message:"color functions take numbers as parameters"}}}function clamp(val){return Math.min(1,Math.max(0,val))}})(require("./tree"));(function(tree){tree.colors={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"}
})(require("./tree"));(function(tree){tree.Alpha=function(val){this.value=val};tree.Alpha.prototype={toCSS:function(){return"alpha(opacity="+(this.value.toCSS?this.value.toCSS():this.value)+")"},eval:function(env){if(this.value.eval){this.value=this.value.eval(env)}return this}}})(require("../tree"));(function(tree){tree.Anonymous=function(string){this.value=string.value||string};tree.Anonymous.prototype={toCSS:function(){return this.value},eval:function(){return this},compare:function(x){if(!x.toCSS){return-1}var left=this.toCSS(),right=x.toCSS();if(left===right){return 0}return left<right?-1:1}}})(require("../tree"));(function(tree){tree.Assignment=function(key,val){this.key=key;this.value=val};tree.Assignment.prototype={toCSS:function(){return this.key+"="+(this.value.toCSS?this.value.toCSS():this.value)},eval:function(env){if(this.value.eval){return new tree.Assignment(this.key,this.value.eval(env))}return this}}})(require("../tree"));(function(tree){tree.Call=function(name,args,index,filename){this.name=name;this.args=args;this.index=index;this.filename=filename};tree.Call.prototype={eval:function(env){var args=this.args.map(function(a){return a.eval(env)}),result;if(this.name in tree.functions){try{result=tree.functions[this.name].apply(tree.functions,args);if(result!=null){return result}}catch(e){throw{type:e.type||"Runtime",message:"error evaluating function `"+this.name+"`"+(e.message?": "+e.message:""),index:this.index,filename:this.filename}}}return new tree.Anonymous(this.name+"("+args.map(function(a){return a.toCSS(env)}).join(", ")+")")},toCSS:function(env){return this.eval(env).toCSS()}}})(require("../tree"));(function(tree){tree.Color=function(rgb,a){if(Array.isArray(rgb)){this.rgb=rgb}else if(rgb.length==6){this.rgb=rgb.match(/.{2}/g).map(function(c){return parseInt(c,16)})}else{this.rgb=rgb.split("").map(function(c){return parseInt(c+c,16)})}this.alpha=typeof a==="number"?a:1};tree.Color.prototype={eval:function(){return this},toCSS:function(){if(this.alpha<1){return"rgba("+this.rgb.map(function(c){return Math.round(c)}).concat(this.alpha).join(", ")+")"}else{return"#"+this.rgb.map(function(i){i=Math.round(i);i=(i>255?255:i<0?0:i).toString(16);return i.length===1?"0"+i:i}).join("")}},operate:function(op,other){var result=[];if(!(other instanceof tree.Color)){other=other.toColor()}for(var c=0;c<3;c++){result[c]=tree.operate(op,this.rgb[c],other.rgb[c])}return new tree.Color(result,this.alpha+other.alpha)},toHSL:function(){var r=this.rgb[0]/255,g=this.rgb[1]/255,b=this.rgb[2]/255,a=this.alpha;var max=Math.max(r,g,b),min=Math.min(r,g,b);var h,s,l=(max+min)/2,d=max-min;if(max===min){h=s=0}else{s=l>.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break}h/=6}return{h:h*360,s:s,l:l,a:a}},toARGB:function(){var argb=[Math.round(this.alpha*255)].concat(this.rgb);return"#"+argb.map(function(i){i=Math.round(i);i=(i>255?255:i<0?0:i).toString(16);return i.length===1?"0"+i:i}).join("")},compare:function(x){if(!x.rgb){return-1}return x.rgb[0]===this.rgb[0]&&x.rgb[1]===this.rgb[1]&&x.rgb[2]===this.rgb[2]&&x.alpha===this.alpha?0:-1}}})(require("../tree"));(function(tree){tree.Comment=function(value,silent){this.value=value;this.silent=!!silent};tree.Comment.prototype={toCSS:function(env){return env.compress?"":this.value},eval:function(){return this}}})(require("../tree"));(function(tree){tree.Condition=function(op,l,r,i,negate){this.op=op.trim();this.lvalue=l;this.rvalue=r;this.index=i;this.negate=negate};tree.Condition.prototype.eval=function(env){var a=this.lvalue.eval(env),b=this.rvalue.eval(env);var i=this.index,result;var result=function(op){switch(op){case"and":return a&&b;case"or":return a||b;default:if(a.compare){result=a.compare(b)}else if(b.compare){result=b.compare(a)}else{throw{type:"Type",message:"Unable to perform comparison",index:i}}switch(result){case-1:return op==="<"||op==="=<";case 0:return op==="="||op===">="||op==="=<";case 1:return op===">"||op===">="}}}(this.op);return this.negate?!result:result}})(require("../tree"));(function(tree){tree.Dimension=function(value,unit){this.value=parseFloat(value);this.unit=unit||null};tree.Dimension.prototype={eval:function(){return this},toColor:function(){return new tree.Color([this.value,this.value,this.value])},toCSS:function(){var css=this.value+this.unit;return css},operate:function(op,other){return new tree.Dimension(tree.operate(op,this.value,other.value),this.unit||other.unit)},compare:function(other){if(other instanceof tree.Dimension){if(other.value>this.value){return-1}else if(other.value<this.value){return 1}else{if(other.unit&&this.unit!==other.unit){return-1}return 0}}else{return-1}}}})(require("../tree"));(function(tree){tree.Directive=function(name,value){this.name=name;if(Array.isArray(value)){this.ruleset=new tree.Ruleset([],value);this.ruleset.allowImports=true}else{this.value=value}};tree.Directive.prototype={toCSS:function(ctx,env){if(this.ruleset){this.ruleset.root=true;return this.name+(env.compress?"{":" {\n  ")+this.ruleset.toCSS(ctx,env).trim().replace(/\n/g,"\n  ")+(env.compress?"}":"\n}\n")}else{return this.name+" "+this.value.toCSS()+";\n"}},eval:function(env){var evaldDirective=this;if(this.ruleset){env.frames.unshift(this);evaldDirective=new tree.Directive(this.name);evaldDirective.ruleset=this.ruleset.eval(env);env.frames.shift()}return evaldDirective},variable:function(name){return tree.Ruleset.prototype.variable.call(this.ruleset,name)},find:function(){return tree.Ruleset.prototype.find.apply(this.ruleset,arguments)},rulesets:function(){return tree.Ruleset.prototype.rulesets.apply(this.ruleset)}}})(require("../tree"));(function(tree){tree.Element=function(combinator,value,index){this.combinator=combinator instanceof tree.Combinator?combinator:new tree.Combinator(combinator);if(typeof value==="string"){this.value=value.trim()}else if(value){this.value=value}else{this.value=""}this.index=index};tree.Element.prototype.eval=function(env){return new tree.Element(this.combinator,this.value.eval?this.value.eval(env):this.value,this.index)};tree.Element.prototype.toCSS=function(env){var value=this.value.toCSS?this.value.toCSS(env):this.value;if(value==""&&this.combinator.value.charAt(0)=="&"){return""}else{return this.combinator.toCSS(env||{})+value}};tree.Combinator=function(value){if(value===" "){this.value=" "}else{this.value=value?value.trim():""}};tree.Combinator.prototype.toCSS=function(env){return{"":""," ":" ",":":" :","+":env.compress?"+":" + ","~":env.compress?"~":" ~ ",">":env.compress?">":" > ","|":env.compress?"|":" | "}[this.value]}})(require("../tree"));(function(tree){tree.Expression=function(value){this.value=value};tree.Expression.prototype={eval:function(env){if(this.value.length>1){return new tree.Expression(this.value.map(function(e){return e.eval(env)}))}else if(this.value.length===1){return this.value[0].eval(env)}else{return this}},toCSS:function(env){return this.value.map(function(e){return e.toCSS?e.toCSS(env):""}).join(" ")}}})(require("../tree"));(function(tree){tree.Import=function(path,imports,features,once,index,rootpath){var that=this;this.once=once;this.index=index;this._path=path;this.features=features&&new tree.Value(features);this.rootpath=rootpath;if(path instanceof tree.Quoted){this.path=/(\.[a-z]*$)|([\?;].*)$/.test(path.value)?path.value:path.value+".less"}else{this.path=path.value.value||path.value}this.css=/css([\?;].*)?$/.test(this.path);if(!this.css){imports.push(this.path,function(e,root,imported){if(e){e.index=index}if(imported&&that.once)that.skip=imported;that.root=root||new tree.Ruleset([],[])})}};tree.Import.prototype={toCSS:function(env){var features=this.features?" "+this.features.toCSS(env):"";if(this.css){if(typeof this._path.value==="string"&&!/^(?:[a-z-]+:|\/)/.test(this._path.value)){this._path.value=this.rootpath+this._path.value}return"@import "+this._path.toCSS()+features+";\n"}else{return""}},eval:function(env){var ruleset,features=this.features&&this.features.eval(env);if(this.skip)return[];if(this.css){return this}else{ruleset=new tree.Ruleset([],this.root.rules.slice(0));ruleset.evalImports(env);return this.features?new tree.Media(ruleset.rules,this.features.value):ruleset.rules}}}})(require("../tree"));(function(tree){tree.JavaScript=function(string,index,escaped){this.escaped=escaped;this.expression=string;this.index=index};tree.JavaScript.prototype={eval:function(env){var result,that=this,context={};var expression=this.expression.replace(/@\{([\w-]+)\}/g,function(_,name){return tree.jsify(new tree.Variable("@"+name,that.index).eval(env))});try{expression=new Function("return ("+expression+")")}catch(e){throw{message:"JavaScript evaluation error: `"+expression+"`",index:this.index}}for(var k in env.frames[0].variables()){context[k.slice(1)]={value:env.frames[0].variables()[k].value,toJS:function(){return this.value.eval(env).toCSS()}}}try{result=expression.call(context)}catch(e){throw{message:"JavaScript evaluation error: '"+e.name+": "+e.message+"'",index:this.index}}if(typeof result==="string"){return new tree.Quoted('"'+result+'"',result,this.escaped,this.index)}else if(Array.isArray(result)){return new tree.Anonymous(result.join(", "))}else{return new tree.Anonymous(result)}}}})(require("../tree"));(function(tree){tree.Keyword=function(value){this.value=value};tree.Keyword.prototype={eval:function(){return this},toCSS:function(){return this.value},compare:function(other){if(other instanceof tree.Keyword){return other.value===this.value?0:1}else{return-1}}};tree.True=new tree.Keyword("true");tree.False=new tree.Keyword("false")})(require("../tree"));(function(tree){tree.Media=function(value,features){var selectors=this.emptySelectors();this.features=new tree.Value(features);this.ruleset=new tree.Ruleset(selectors,value);this.ruleset.allowImports=true};tree.Media.prototype={toCSS:function(ctx,env){var features=this.features.toCSS(env);this.ruleset.root=ctx.length===0||ctx[0].multiMedia;return"@media "+features+(env.compress?"{":" {\n  ")+this.ruleset.toCSS(ctx,env).trim().replace(/\n/g,"\n  ")+(env.compress?"}":"\n}\n")},eval:function(env){if(!env.mediaBlocks){env.mediaBlocks=[];env.mediaPath=[]}var media=new tree.Media([],[]);if(this.debugInfo){this.ruleset.debugInfo=this.debugInfo;media.debugInfo=this.debugInfo}media.features=this.features.eval(env);env.mediaPath.push(media);env.mediaBlocks.push(media);env.frames.unshift(this.ruleset);media.ruleset=this.ruleset.eval(env);env.frames.shift();env.mediaPath.pop();return env.mediaPath.length===0?media.evalTop(env):media.evalNested(env)},variable:function(name){return tree.Ruleset.prototype.variable.call(this.ruleset,name)},find:function(){return tree.Ruleset.prototype.find.apply(this.ruleset,arguments)},rulesets:function(){return tree.Ruleset.prototype.rulesets.apply(this.ruleset)},emptySelectors:function(){var el=new tree.Element("","&",0);return[new tree.Selector([el])]},evalTop:function(env){var result=this;if(env.mediaBlocks.length>1){var selectors=this.emptySelectors();result=new tree.Ruleset(selectors,env.mediaBlocks);result.multiMedia=true}delete env.mediaBlocks;delete env.mediaPath;return result},evalNested:function(env){var i,value,path=env.mediaPath.concat([this]);for(i=0;i<path.length;i++){value=path[i].features instanceof tree.Value?path[i].features.value:path[i].features;path[i]=Array.isArray(value)?value:[value]}this.features=new tree.Value(this.permute(path).map(function(path){path=path.map(function(fragment){return fragment.toCSS?fragment:new tree.Anonymous(fragment)});for(i=path.length-1;i>0;i--){path.splice(i,0,new tree.Anonymous("and"))}return new tree.Expression(path)}));return new tree.Ruleset([],[])},permute:function(arr){if(arr.length===0){return[]}else if(arr.length===1){return arr[0]}else{var result=[];var rest=this.permute(arr.slice(1));for(var i=0;i<rest.length;i++){for(var j=0;j<arr[0].length;j++){result.push([arr[0][j]].concat(rest[i]))}}return result}},bubbleSelectors:function(selectors){this.ruleset=new tree.Ruleset(selectors.slice(0),[this.ruleset])}}})(require("../tree"));(function(tree){tree.mixin={};tree.mixin.Call=function(elements,args,index,filename,important){this.selector=new tree.Selector(elements);this.arguments=args;this.index=index;this.filename=filename;this.important=important};tree.mixin.Call.prototype={eval:function(env){var mixins,mixin,args,rules=[],match=false,i,m,f,isRecursive,isOneFound;args=this.arguments&&this.arguments.map(function(a){return{name:a.name,value:a.value.eval(env)}});for(i=0;i<env.frames.length;i++){if((mixins=env.frames[i].find(this.selector)).length>0){isOneFound=true;for(m=0;m<mixins.length;m++){mixin=mixins[m];isRecursive=false;for(f=0;f<env.frames.length;f++){if(!(mixin instanceof tree.mixin.Definition)&&mixin===(env.frames[f].originalRuleset||env.frames[f])){isRecursive=true;break}}if(isRecursive){continue}if(mixin.matchArgs(args,env)){if(!mixin.matchCondition||mixin.matchCondition(args,env)){try{Array.prototype.push.apply(rules,mixin.eval(env,args,this.important).rules)}catch(e){throw{message:e.message,index:this.index,filename:this.filename,stack:e.stack}}}match=true}}if(match){return rules}}}if(isOneFound){throw{type:"Runtime",message:"No matching definition was found for `"+this.selector.toCSS().trim()+"("+(args?args.map(function(a){var argValue="";if(a.name){argValue+=a.name+":"}if(a.value.toCSS){argValue+=a.value.toCSS()}else{argValue+="???"}return argValue}).join(", "):"")+")`",index:this.index,filename:this.filename}}else{throw{type:"Name",message:this.selector.toCSS().trim()+" is undefined",index:this.index,filename:this.filename}}}};tree.mixin.Definition=function(name,params,rules,condition,variadic){this.name=name;this.selectors=[new tree.Selector([new tree.Element(null,name)])];this.params=params;this.condition=condition;this.variadic=variadic;this.arity=params.length;this.rules=rules;this._lookups={};this.required=params.reduce(function(count,p){if(!p.name||p.name&&!p.value){return count+1}else{return count}},0);this.parent=tree.Ruleset.prototype;this.frames=[]};tree.mixin.Definition.prototype={toCSS:function(){return""},variable:function(name){return this.parent.variable.call(this,name)},variables:function(){return this.parent.variables.call(this)},find:function(){return this.parent.find.apply(this,arguments)},rulesets:function(){return this.parent.rulesets.apply(this)},evalParams:function(env,mixinEnv,args,evaldArguments){var frame=new tree.Ruleset(null,[]),varargs,arg,params=this.params.slice(0),i,j,val,name,isNamedFound,argIndex;if(args){args=args.slice(0);for(i=0;i<args.length;i++){arg=args[i];if(name=arg&&arg.name){isNamedFound=false;for(j=0;j<params.length;j++){if(!evaldArguments[j]&&name===params[j].name){evaldArguments[j]=arg.value.eval(env);frame.rules.unshift(new tree.Rule(name,arg.value.eval(env)));isNamedFound=true;break}}if(isNamedFound){args.splice(i,1);i--;continue}else{throw{type:"Runtime",message:"Named argument for "+this.name+" "+args[i].name+" not found"}}}}}argIndex=0;for(i=0;i<params.length;i++){if(evaldArguments[i])continue;arg=args&&args[argIndex];if(name=params[i].name){if(params[i].variadic&&args){varargs=[];for(j=argIndex;j<args.length;j++){varargs.push(args[j].value.eval(env))}frame.rules.unshift(new tree.Rule(name,new tree.Expression(varargs).eval(env)))}else{val=arg&&arg.value;if(val){val=val.eval(env)}else if(params[i].value){val=params[i].value.eval(mixinEnv)}else{throw{type:"Runtime",message:"wrong number of arguments for "+this.name+" ("+args.length+" for "+this.arity+")"}}frame.rules.unshift(new tree.Rule(name,val));evaldArguments[i]=val}}if(params[i].variadic&&args){for(j=argIndex;j<args.length;j++){evaldArguments[j]=args[j].value.eval(env)}}argIndex++}return frame},eval:function(env,args,important){var _arguments=[],mixinFrames=this.frames.concat(env.frames),frame=this.evalParams(env,{frames:mixinFrames},args,_arguments),context,rules,start,ruleset;frame.rules.unshift(new tree.Rule("@arguments",new tree.Expression(_arguments).eval(env)));rules=important?this.parent.makeImportant.apply(this).rules:this.rules.slice(0);ruleset=new tree.Ruleset(null,rules).eval({frames:[this,frame].concat(mixinFrames)});ruleset.originalRuleset=this;return ruleset},matchCondition:function(args,env){if(this.condition&&!this.condition.eval({frames:[this.evalParams(env,{frames:this.frames.concat(env.frames)},args,[])].concat(env.frames)})){return false}return true},matchArgs:function(args,env){var argsLength=args&&args.length||0,len,frame;if(!this.variadic){if(argsLength<this.required){return false}if(argsLength>this.params.length){return false}if(this.required>0&&argsLength>this.params.length){return false}}len=Math.min(argsLength,this.arity);for(var i=0;i<len;i++){if(!this.params[i].name&&!this.params[i].variadic){if(args[i].value.eval(env).toCSS()!=this.params[i].value.eval(env).toCSS()){return false}}}return true}}})(require("../tree"));(function(tree){tree.Operation=function(op,operands){this.op=op.trim();this.operands=operands};tree.Operation.prototype.eval=function(env){var a=this.operands[0].eval(env),b=this.operands[1].eval(env),temp;if(a instanceof tree.Dimension&&b instanceof tree.Color){if(this.op==="*"||this.op==="+"){temp=b,b=a,a=temp}else{throw{name:"OperationError",message:"Can't substract or divide a color from a number"}}}if(!a.operate){throw{name:"OperationError",message:"Operation on an invalid type"}}return a.operate(this.op,b)};tree.operate=function(op,a,b){switch(op){case"+":return a+b;case"-":return a-b;case"*":return a*b;case"/":return a/b}}})(require("../tree"));(function(tree){tree.Paren=function(node){this.value=node};tree.Paren.prototype={toCSS:function(env){return"("+this.value.toCSS(env)+")"},eval:function(env){return new tree.Paren(this.value.eval(env))}}})(require("../tree"));(function(tree){tree.Quoted=function(str,content,escaped,i){this.escaped=escaped;this.value=content||"";this.quote=str.charAt(0);this.index=i};tree.Quoted.prototype={toCSS:function(){if(this.escaped){return this.value}else{return this.quote+this.value+this.quote}},eval:function(env){var that=this;var value=this.value.replace(/`([^`]+)`/g,function(_,exp){return new tree.JavaScript(exp,that.index,true).eval(env).value}).replace(/@\{([\w-]+)\}/g,function(_,name){var v=new tree.Variable("@"+name,that.index).eval(env);return v instanceof tree.Quoted?v.value:v.toCSS()});return new tree.Quoted(this.quote+value+this.quote,value,this.escaped,this.index)},compare:function(x){if(!x.toCSS){return-1}var left=this.toCSS(),right=x.toCSS();if(left===right){return 0}return left<right?-1:1}}})(require("../tree"));(function(tree){tree.Ratio=function(value){this.value=value};tree.Ratio.prototype={toCSS:function(env){return this.value},eval:function(){return this}}})(require("../tree"));(function(tree){tree.Rule=function(name,value,important,index,inline){this.name=name;this.value=value instanceof tree.Value?value:new tree.Value([value]);this.important=important?" "+important.trim():"";this.index=index;this.inline=inline||false;if(name.charAt(0)==="@"){this.variable=true}else{this.variable=false}};tree.Rule.prototype.toCSS=function(env){if(this.variable){return""}else{return this.name+(env.compress?":":": ")+this.value.toCSS(env)+this.important+(this.inline?"":";")}};tree.Rule.prototype.eval=function(context){return new tree.Rule(this.name,this.value.eval(context),this.important,this.index,this.inline)};tree.Rule.prototype.makeImportant=function(){return new tree.Rule(this.name,this.value,"!important",this.index,this.inline)};tree.Shorthand=function(a,b){this.a=a;this.b=b};tree.Shorthand.prototype={toCSS:function(env){return this.a.toCSS(env)+"/"+this.b.toCSS(env)},eval:function(){return this}}})(require("../tree"));(function(tree){tree.Ruleset=function(selectors,rules,strictImports){this.selectors=selectors;this.rules=rules;this._lookups={};this.strictImports=strictImports};tree.Ruleset.prototype={eval:function(env){var selectors=this.selectors&&this.selectors.map(function(s){return s.eval(env)});var ruleset=new tree.Ruleset(selectors,this.rules.slice(0),this.strictImports);var rules;ruleset.originalRuleset=this;ruleset.root=this.root;ruleset.allowImports=this.allowImports;if(this.debugInfo){ruleset.debugInfo=this.debugInfo}env.frames.unshift(ruleset);if(ruleset.root||ruleset.allowImports||!ruleset.strictImports){ruleset.evalImports(env)}for(var i=0;i<ruleset.rules.length;i++){if(ruleset.rules[i]instanceof tree.mixin.Definition){ruleset.rules[i].frames=env.frames.slice(0)}}var mediaBlockCount=env.mediaBlocks&&env.mediaBlocks.length||0;for(var i=0;i<ruleset.rules.length;i++){if(ruleset.rules[i]instanceof tree.mixin.Call){rules=ruleset.rules[i].eval(env);ruleset.rules.splice.apply(ruleset.rules,[i,1].concat(rules));i+=rules.length-1;ruleset.resetCache()}}for(var i=0,rule;i<ruleset.rules.length;i++){rule=ruleset.rules[i];if(!(rule instanceof tree.mixin.Definition)){ruleset.rules[i]=rule.eval?rule.eval(env):rule}}env.frames.shift();if(env.mediaBlocks){for(var i=mediaBlockCount;i<env.mediaBlocks.length;i++){env.mediaBlocks[i].bubbleSelectors(selectors)}}return ruleset},evalImports:function(env){var i,rules;for(i=0;i<this.rules.length;i++){if(this.rules[i]instanceof tree.Import){rules=this.rules[i].eval(env);if(typeof rules.length==="number"){this.rules.splice.apply(this.rules,[i,1].concat(rules));i+=rules.length-1}else{this.rules.splice(i,1,rules)}this.resetCache()}}},makeImportant:function(){return new tree.Ruleset(this.selectors,this.rules.map(function(r){if(r.makeImportant){return r.makeImportant()}else{return r}}),this.strictImports)},matchArgs:function(args){return!args||args.length===0},resetCache:function(){this._rulesets=null;this._variables=null;this._lookups={}},variables:function(){if(this._variables){return this._variables}else{return this._variables=this.rules.reduce(function(hash,r){if(r instanceof tree.Rule&&r.variable===true){hash[r.name]=r}return hash},{})}},variable:function(name){return this.variables()[name]},rulesets:function(){if(this._rulesets){return this._rulesets}else{return this._rulesets=this.rules.filter(function(r){return r instanceof tree.Ruleset||r instanceof tree.mixin.Definition})}},find:function(selector,self){self=self||this;var rules=[],rule,match,key=selector.toCSS();if(key in this._lookups){return this._lookups[key]}this.rulesets().forEach(function(rule){if(rule!==self){for(var j=0;j<rule.selectors.length;j++){if(match=selector.match(rule.selectors[j])){if(selector.elements.length>rule.selectors[j].elements.length){Array.prototype.push.apply(rules,rule.find(new tree.Selector(selector.elements.slice(1)),self))}else{rules.push(rule)}break}}}});return this._lookups[key]=rules},toCSS:function(context,env){var css=[],rules=[],_rules=[],rulesets=[],paths=[],selector,debugInfo,rule;if(!this.root){this.joinSelectors(paths,context,this.selectors)}for(var i=0;i<this.rules.length;i++){rule=this.rules[i];if(rule.rules||rule instanceof tree.Media){rulesets.push(rule.toCSS(paths,env))}else if(rule instanceof tree.Directive){var cssValue=rule.toCSS(paths,env);if(rule.name==="@charset"){if(env.charset){if(rule.debugInfo){rulesets.push(tree.debugInfo(env,rule));rulesets.push(new tree.Comment("/* "+cssValue.replace(/\n/g,"")+" */\n").toCSS(env))}continue}env.charset=true}rulesets.push(cssValue)}else if(rule instanceof tree.Comment){if(!rule.silent){if(this.root){rulesets.push(rule.toCSS(env))}else{rules.push(rule.toCSS(env))}}}else{if(rule.toCSS&&!rule.variable){rules.push(rule.toCSS(env))}else if(rule.value&&!rule.variable){rules.push(rule.value.toString())}}}rulesets=rulesets.join("");if(this.root){css.push(rules.join(env.compress?"":"\n"))}else{if(rules.length>0){debugInfo=tree.debugInfo(env,this);selector=paths.map(function(p){return p.map(function(s){return s.toCSS(env)}).join("").trim()}).join(env.compress?",":",\n");for(var i=rules.length-1;i>=0;i--){if(_rules.indexOf(rules[i])===-1){_rules.unshift(rules[i])}}rules=_rules;css.push(debugInfo+selector+(env.compress?"{":" {\n  ")+rules.join(env.compress?"":"\n  ")+(env.compress?"}":"\n}\n"))}}css.push(rulesets);return css.join("")+(env.compress?"\n":"")},joinSelectors:function(paths,context,selectors){for(var s=0;s<selectors.length;s++){this.joinSelector(paths,context,selectors[s])}},joinSelector:function(paths,context,selector){var i,j,k,hasParentSelector,newSelectors,el,sel,parentSel,newSelectorPath,afterParentJoin,newJoinedSelector,newJoinedSelectorEmpty,lastSelector,currentElements,selectorsMultiplied;for(i=0;i<selector.elements.length;i++){el=selector.elements[i];if(el.value==="&"){hasParentSelector=true}}if(!hasParentSelector){if(context.length>0){for(i=0;i<context.length;i++){paths.push(context[i].concat(selector))}}else{paths.push([selector])}return}currentElements=[];newSelectors=[[]];for(i=0;i<selector.elements.length;i++){el=selector.elements[i];if(el.value!=="&"){currentElements.push(el)}else{selectorsMultiplied=[];if(currentElements.length>0){this.mergeElementsOnToSelectors(currentElements,newSelectors)}for(j=0;j<newSelectors.length;j++){sel=newSelectors[j];if(context.length==0){if(sel.length>0){sel[0].elements=sel[0].elements.slice(0);sel[0].elements.push(new tree.Element(el.combinator,"",0))}selectorsMultiplied.push(sel)}else{for(k=0;k<context.length;k++){parentSel=context[k];newSelectorPath=[];afterParentJoin=[];newJoinedSelectorEmpty=true;if(sel.length>0){newSelectorPath=sel.slice(0);lastSelector=newSelectorPath.pop();newJoinedSelector=new tree.Selector(lastSelector.elements.slice(0));newJoinedSelectorEmpty=false}else{newJoinedSelector=new tree.Selector([])}if(parentSel.length>1){afterParentJoin=afterParentJoin.concat(parentSel.slice(1))}if(parentSel.length>0){newJoinedSelectorEmpty=false;newJoinedSelector.elements.push(new tree.Element(el.combinator,parentSel[0].elements[0].value,0));newJoinedSelector.elements=newJoinedSelector.elements.concat(parentSel[0].elements.slice(1))}if(!newJoinedSelectorEmpty){newSelectorPath.push(newJoinedSelector)}newSelectorPath=newSelectorPath.concat(afterParentJoin);selectorsMultiplied.push(newSelectorPath)}}}newSelectors=selectorsMultiplied;currentElements=[]}}if(currentElements.length>0){this.mergeElementsOnToSelectors(currentElements,newSelectors)}for(i=0;i<newSelectors.length;i++){paths.push(newSelectors[i])}},mergeElementsOnToSelectors:function(elements,selectors){var i,sel;if(selectors.length==0){selectors.push([new tree.Selector(elements)]);return}for(i=0;i<selectors.length;i++){sel=selectors[i];if(sel.length>0){sel[sel.length-1]=new tree.Selector(sel[sel.length-1].elements.concat(elements))}else{sel.push(new tree.Selector(elements))}}}}})(require("../tree"));(function(tree){tree.Selector=function(elements){this.elements=elements};tree.Selector.prototype.match=function(other){var elements=this.elements,len=elements.length,oelements,olen,max,i;oelements=other.elements.slice(other.elements.length&&other.elements[0].value==="&"?1:0);olen=oelements.length;max=Math.min(len,olen);if(olen===0||len<olen){return false}else{for(i=0;i<max;i++){if(elements[i].value!==oelements[i].value){return false}}}return true};tree.Selector.prototype.eval=function(env){return new tree.Selector(this.elements.map(function(e){return e.eval(env)}))};tree.Selector.prototype.toCSS=function(env){if(this._css){return this._css}if(this.elements[0].combinator.value===""){this._css=" "}else{this._css=""}this._css+=this.elements.map(function(e){if(typeof e==="string"){return" "+e.trim()}else{return e.toCSS(env)}}).join("");return this._css}})(require("../tree"));(function(tree){tree.UnicodeDescriptor=function(value){this.value=value};tree.UnicodeDescriptor.prototype={toCSS:function(env){return this.value},eval:function(){return this}}})(require("../tree"));(function(tree){tree.URL=function(val,rootpath){this.value=val;this.rootpath=rootpath};tree.URL.prototype={toCSS:function(){return"url("+this.value.toCSS()+")"},eval:function(ctx){var val=this.value.eval(ctx),rootpath;if(typeof val.value==="string"&&!/^(?:[a-z-]+:|\/)/.test(val.value)){rootpath=this.rootpath;if(!val.quote){rootpath=rootpath.replace(/[\(\)'"\s]/g,function(match){return"\\"+match})}val.value=rootpath+val.value}return new tree.URL(val,this.rootpath)}}})(require("../tree"));(function(tree){tree.Value=function(value){this.value=value;this.is="value"};tree.Value.prototype={eval:function(env){if(this.value.length===1){return this.value[0].eval(env)}else{return new tree.Value(this.value.map(function(v){return v.eval(env)}))}},toCSS:function(env){return this.value.map(function(e){return e.toCSS(env)}).join(env.compress?",":", ")}}})(require("../tree"));(function(tree){tree.Variable=function(name,index,file){this.name=name,this.index=index,this.file=file};tree.Variable.prototype={eval:function(env){var variable,v,name=this.name;if(name.indexOf("@@")==0){name="@"+new tree.Variable(name.slice(1)).eval(env).value}if(this.evaluating){throw{type:"Name",message:"Recursive variable definition for "+name,filename:this.file,index:this.index}}this.evaluating=true;if(variable=tree.find(env.frames,function(frame){if(v=frame.variable(name)){return v.value.eval(env)}})){this.evaluating=false;return variable}else{throw{type:"Name",message:"variable "+name+" is undefined",filename:this.file,index:this.index}}}}})(require("../tree"));(function(tree){tree.debugInfo=function(env,ctx){var result="";if(env.dumpLineNumbers&&!env.compress){switch(env.dumpLineNumbers){case"comments":result=tree.debugInfo.asComment(ctx);break;case"mediaquery":result=tree.debugInfo.asMediaQuery(ctx);break;case"all":result=tree.debugInfo.asComment(ctx)+tree.debugInfo.asMediaQuery(ctx);break}}return result};tree.debugInfo.asComment=function(ctx){return"/* line "+ctx.debugInfo.lineNumber+", "+ctx.debugInfo.fileName+" */\n"};tree.debugInfo.asMediaQuery=function(ctx){return"@media -sass-debug-info{filename{font-family:"+("file://"+ctx.debugInfo.fileName).replace(/[\/:.]/g,"\\$&")+"}line{font-family:\\00003"+ctx.debugInfo.lineNumber+"}}\n"};tree.find=function(obj,fun){for(var i=0,r;i<obj.length;i++){if(r=fun.call(obj,obj[i])){return r}}return null};tree.jsify=function(obj){if(Array.isArray(obj.value)&&obj.value.length>1){return"["+obj.value.map(function(v){return v.toCSS(false)}).join(", ")+"]"}else{return obj.toCSS(false)}}})(require("./tree"));var isFileProtocol=/^(file|chrome(-extension)?|resource|qrc|app):/.test(location.protocol);less.env=less.env||(location.hostname=="127.0.0.1"||location.hostname=="0.0.0.0"||location.hostname=="localhost"||location.port.length>0||isFileProtocol?"development":"production");less.async=less.async||false;less.fileAsync=less.fileAsync||false;less.poll=less.poll||(isFileProtocol?1e3:1500);if(less.functions){for(var func in less.functions){less.tree.functions[func]=less.functions[func]}}var dumpLineNumbers=/!dumpLineNumbers:(comments|mediaquery|all)/.exec(location.hash);if(dumpLineNumbers){less.dumpLineNumbers=dumpLineNumbers[1]}less.watch=function(){if(!less.watchMode){less.env="development";initRunningMode()}return this.watchMode=true};less.unwatch=function(){clearInterval(less.watchTimer);return this.watchMode=false};function initRunningMode(){if(less.env==="development"){less.optimization=0;less.watchTimer=setInterval(function(){if(less.watchMode){loadStyleSheets(function(e,root,_,sheet,env){if(root){createCSS(root.toCSS(),sheet,env.lastModified)}})}},less.poll)}else{less.optimization=3}}if(/!watch/.test(location.hash)){less.watch()}var cache=null;if(less.env!="development"){try{cache=typeof window.localStorage==="undefined"?null:window.localStorage}catch(_){}}var links=document.getElementsByTagName("link");var typePattern=/^text\/(x-)?less$/;less.sheets=[];for(var i=0;i<links.length;i++){if(links[i].rel==="stylesheet/less"||links[i].rel.match(/stylesheet/)&&links[i].type.match(typePattern)){less.sheets.push(links[i])}}var session_cache="";less.modifyVars=function(record){var str=session_cache;for(name in record){str+=(name.slice(0,1)==="@"?"":"@")+name+": "+(record[name].slice(-1)===";"?record[name]:record[name]+";")
}(new less.Parser).parse(str,function(e,root){createCSS(root.toCSS(),less.sheets[less.sheets.length-1])})};less.refresh=function(reload){var startTime,endTime;startTime=endTime=new Date;loadStyleSheets(function(e,root,_,sheet,env){if(env.local){log("loading "+sheet.href+" from cache.")}else{log("parsed "+sheet.href+" successfully.");createCSS(root.toCSS(),sheet,env.lastModified)}log("css for "+sheet.href+" generated in "+(new Date-endTime)+"ms");env.remaining===0&&log("css generated in "+(new Date-startTime)+"ms");endTime=new Date},reload);loadStyles()};less.refreshStyles=loadStyles;less.refresh(less.env==="development");function loadStyles(){var styles=document.getElementsByTagName("style");for(var i=0;i<styles.length;i++){if(styles[i].type.match(typePattern)){new less.Parser({filename:document.location.href.replace(/#.*$/,""),dumpLineNumbers:less.dumpLineNumbers}).parse(styles[i].innerHTML||"",function(e,tree){var css=tree.toCSS();var style=styles[i];style.type="text/css";if(style.styleSheet){style.styleSheet.cssText=css}else{style.innerHTML=css}})}}}function loadStyleSheets(callback,reload){for(var i=0;i<less.sheets.length;i++){loadStyleSheet(less.sheets[i],callback,reload,less.sheets.length-(i+1))}}function pathDiff(url,baseUrl){var urlParts=extractUrlParts(url),baseUrlParts=extractUrlParts(baseUrl),i,max,urlDirectories,baseUrlDirectories,diff="";if(urlParts.hostPart!==baseUrlParts.hostPart){return""}max=Math.max(baseUrlParts.directories.length,urlParts.directories.length);for(i=0;i<max;i++){if(baseUrlParts.directories[i]!==urlParts.directories[i]){break}}baseUrlDirectories=baseUrlParts.directories.slice(i);urlDirectories=urlParts.directories.slice(i);for(i=0;i<baseUrlDirectories.length-1;i++){diff+="../"}for(i=0;i<urlDirectories.length-1;i++){diff+=urlDirectories[i]+"/"}return diff}function extractUrlParts(url,baseUrl){var urlPartsRegex=/^((?:[a-z-]+:)?\/\/(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/,urlParts=url.match(urlPartsRegex),returner={},directories=[],i,baseUrlParts;if(!urlParts){throw new Error("Could not parse sheet href - '"+url+"'")}if(!urlParts[1]||urlParts[2]){baseUrlParts=baseUrl.match(urlPartsRegex);if(!baseUrlParts){throw new Error("Could not parse page url - '"+baseUrl+"'")}urlParts[1]=baseUrlParts[1];if(!urlParts[2]){urlParts[3]=baseUrlParts[3]+urlParts[3]}}if(urlParts[3]){directories=urlParts[3].replace("\\","/").split("/");for(i=0;i<directories.length;i++){if(directories[i]===".."&&i>0){directories.splice(i-1,2);i-=2}}}returner.hostPart=urlParts[1];returner.directories=directories;returner.path=urlParts[1]+directories.join("/");returner.fileUrl=returner.path+(urlParts[4]||"");returner.url=returner.fileUrl+(urlParts[5]||"");return returner}function loadStyleSheet(sheet,callback,reload,remaining){var contents=sheet.contents||{};var files=sheet.files||{};var hrefParts=extractUrlParts(sheet.href,window.location.href);var href=hrefParts.url;var css=cache&&cache.getItem(href);var timestamp=cache&&cache.getItem(href+":timestamp");var styles={css:css,timestamp:timestamp};var rootpath;if(less.relativeUrls){if(less.rootpath){if(sheet.entryPath){rootpath=extractUrlParts(less.rootpath+pathDiff(hrefParts.path,sheet.entryPath)).path}else{rootpath=less.rootpath}}else{rootpath=hrefParts.path}}else{if(less.rootpath){rootpath=less.rootpath}else{if(sheet.entryPath){rootpath=sheet.entryPath}else{rootpath=hrefParts.path}}}xhr(href,sheet.type,function(data,lastModified){session_cache+=data.replace(/@import .+?;/gi,"");if(!reload&&styles&&lastModified&&new Date(lastModified).valueOf()===new Date(styles.timestamp).valueOf()){createCSS(styles.css,sheet);callback(null,null,data,sheet,{local:true,remaining:remaining},href)}else{try{contents[href]=data;new less.Parser({optimization:less.optimization,paths:[hrefParts.path],entryPath:sheet.entryPath||hrefParts.path,mime:sheet.type,filename:href,rootpath:rootpath,relativeUrls:sheet.relativeUrls,contents:contents,files:files,dumpLineNumbers:less.dumpLineNumbers}).parse(data,function(e,root){if(e){return error(e,href)}try{callback(e,root,data,sheet,{local:false,lastModified:lastModified,remaining:remaining},href);removeNode(document.getElementById("less-error-message:"+extractId(href)))}catch(e){error(e,href)}})}catch(e){error(e,href)}}},function(status,url){throw new Error("Couldn't load "+url+" ("+status+")")})}function extractId(href){return href.replace(/^[a-z]+:\/\/?[^\/]+/,"").replace(/^\//,"").replace(/\.[a-zA-Z]+$/,"").replace(/[^\.\w-]+/g,"-").replace(/\./g,":")}function createCSS(styles,sheet,lastModified){var css;var href=sheet.href||"";var id="less:"+(sheet.title||extractId(href));if((css=document.getElementById(id))===null){css=document.createElement("style");css.type="text/css";if(sheet.media){css.media=sheet.media}css.id=id;var nextEl=sheet&&sheet.nextSibling||null;(nextEl||document.getElementsByTagName("head")[0]).parentNode.insertBefore(css,nextEl)}if(css.styleSheet){try{css.styleSheet.cssText=styles}catch(e){throw new Error("Couldn't reassign styleSheet.cssText.")}}else{(function(node){if(css.childNodes.length>0){if(css.firstChild.nodeValue!==node.nodeValue){css.replaceChild(node,css.firstChild)}}else{css.appendChild(node)}})(document.createTextNode(styles))}if(lastModified&&cache){log("saving "+href+" to cache.");try{cache.setItem(href,styles);cache.setItem(href+":timestamp",lastModified)}catch(e){log("failed to save")}}}function xhr(url,type,callback,errback){var xhr=getXMLHttpRequest();var async=isFileProtocol?less.fileAsync:less.async;if(typeof xhr.overrideMimeType==="function"){xhr.overrideMimeType("text/css")}xhr.open("GET",url,async);xhr.setRequestHeader("Accept",type||"text/x-less, text/css; q=0.9, */*; q=0.5");xhr.send(null);if(isFileProtocol&&!less.fileAsync){if(xhr.status===0||xhr.status>=200&&xhr.status<300){callback(xhr.responseText)}else{errback(xhr.status,url)}}else if(async){xhr.onreadystatechange=function(){if(xhr.readyState==4){handleResponse(xhr,callback,errback)}}}else{handleResponse(xhr,callback,errback)}function handleResponse(xhr,callback,errback){if(xhr.status>=200&&xhr.status<300){callback(xhr.responseText,xhr.getResponseHeader("Last-Modified"))}else if(typeof errback==="function"){errback(xhr.status,url)}}}function getXMLHttpRequest(){if(window.XMLHttpRequest){return new XMLHttpRequest}else{try{return new ActiveXObject("MSXML2.XMLHTTP.3.0")}catch(e){log("browser doesn't support AJAX.");return null}}}function removeNode(node){return node&&node.parentNode.removeChild(node)}function log(str){if(less.env=="development"&&typeof console!=="undefined"){console.log("less: "+str)}}function error(e,href){var id="less-error-message:"+extractId(href);var template='<li><label>{line}</label><pre class="{class}">{content}</pre></li>';var elem=document.createElement("div"),timer,content,error=[];var filename=e.filename||href;var filenameNoPath=filename.match(/([^\/]+(\?.*)?)$/)[1];elem.id=id;elem.className="less-error-message";content="<h3>"+(e.message||"There is an error in your .less file")+"</h3>"+'<p>in <a href="'+filename+'">'+filenameNoPath+"</a> ";var errorline=function(e,i,classname){if(e.extract[i]){error.push(template.replace(/\{line\}/,parseInt(e.line)+(i-1)).replace(/\{class\}/,classname).replace(/\{content\}/,e.extract[i]))}};if(e.stack){content+="<br/>"+e.stack.split("\n").slice(1).join("<br/>")}else if(e.extract){errorline(e,0,"");errorline(e,1,"line");errorline(e,2,"");content+="on line "+e.line+", column "+(e.column+1)+":</p>"+"<ul>"+error.join("")+"</ul>"}elem.innerHTML=content;createCSS([".less-error-message ul, .less-error-message li {","list-style-type: none;","margin-right: 15px;","padding: 4px 0;","margin: 0;","}",".less-error-message label {","font-size: 12px;","margin-right: 15px;","padding: 4px 0;","color: #cc7777;","}",".less-error-message pre {","color: #dd6666;","padding: 4px 0;","margin: 0;","display: inline-block;","}",".less-error-message pre.line {","color: #ff0000;","}",".less-error-message h3 {","font-size: 20px;","font-weight: bold;","padding: 15px 0 5px 0;","margin: 0;","}",".less-error-message a {","color: #10a","}",".less-error-message .error {","color: red;","font-weight: bold;","padding-bottom: 2px;","border-bottom: 1px dashed red;","}"].join("\n"),{title:"error-message"});elem.style.cssText=["font-family: Arial, sans-serif","border: 1px solid #e00","background-color: #eee","border-radius: 5px","-webkit-border-radius: 5px","-moz-border-radius: 5px","color: #e00","padding: 15px","margin-bottom: 15px"].join(";");if(less.env=="development"){timer=setInterval(function(){if(document.body){if(document.getElementById(id)){document.body.replaceChild(elem,document.getElementById(id))}else{document.body.insertBefore(elem,document.body.firstChild)}clearInterval(timer)}},10)}}if(typeof define==="function"&&define.amd){define("less",[],function(){return less})}})(window);(function(window,undefined){var rootjQuery,readyList,document=window.document,location=window.location,navigator=window.navigator,_jQuery=window.jQuery,_$=window.$,core_push=Array.prototype.push,core_slice=Array.prototype.slice,core_indexOf=Array.prototype.indexOf,core_toString=Object.prototype.toString,core_hasOwn=Object.prototype.hasOwnProperty,core_trim=String.prototype.trim,jQuery=function(selector,context){return new jQuery.fn.init(selector,context,rootjQuery)},core_pnum=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,core_rnotwhite=/\S/,core_rspace=/\s+/,rtrim=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,rquickExpr=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,rsingleTag=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,rvalidchars=/^[\],:{}\s]*$/,rvalidbraces=/(?:^|:|,)(?:\s*\[)+/g,rvalidescape=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,rvalidtokens=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,rmsPrefix=/^-ms-/,rdashAlpha=/-([\da-z])/gi,fcamelCase=function(all,letter){return(letter+"").toUpperCase()},DOMContentLoaded=function(){if(document.addEventListener){document.removeEventListener("DOMContentLoaded",DOMContentLoaded,false);jQuery.ready()}else if(document.readyState==="complete"){document.detachEvent("onreadystatechange",DOMContentLoaded);jQuery.ready()}},class2type={};jQuery.fn=jQuery.prototype={constructor:jQuery,init:function(selector,context,rootjQuery){var match,elem,ret,doc;if(!selector){return this}if(selector.nodeType){this.context=this[0]=selector;this.length=1;return this}if(typeof selector==="string"){if(selector.charAt(0)==="<"&&selector.charAt(selector.length-1)===">"&&selector.length>=3){match=[null,selector,null]}else{match=rquickExpr.exec(selector)}if(match&&(match[1]||!context)){if(match[1]){context=context instanceof jQuery?context[0]:context;doc=context&&context.nodeType?context.ownerDocument||context:document;selector=jQuery.parseHTML(match[1],doc,true);if(rsingleTag.test(match[1])&&jQuery.isPlainObject(context)){this.attr.call(selector,context,true)}return jQuery.merge(this,selector)}else{elem=document.getElementById(match[2]);if(elem&&elem.parentNode){if(elem.id!==match[2]){return rootjQuery.find(selector)}this.length=1;this[0]=elem}this.context=document;this.selector=selector;return this}}else if(!context||context.jquery){return(context||rootjQuery).find(selector)}else{return this.constructor(context).find(selector)}}else if(jQuery.isFunction(selector)){return rootjQuery.ready(selector)}if(selector.selector!==undefined){this.selector=selector.selector;this.context=selector.context}return jQuery.makeArray(selector,this)},selector:"",jquery:"1.8.3",length:0,size:function(){return this.length},toArray:function(){return core_slice.call(this)},get:function(num){return num==null?this.toArray():num<0?this[this.length+num]:this[num]},pushStack:function(elems,name,selector){var ret=jQuery.merge(this.constructor(),elems);ret.prevObject=this;ret.context=this.context;if(name==="find"){ret.selector=this.selector+(this.selector?" ":"")+selector}else if(name){ret.selector=this.selector+"."+name+"("+selector+")"}return ret},each:function(callback,args){return jQuery.each(this,callback,args)},ready:function(fn){jQuery.ready.promise().done(fn);return this},eq:function(i){i=+i;return i===-1?this.slice(i):this.slice(i,i+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(core_slice.apply(this,arguments),"slice",core_slice.call(arguments).join(","))},map:function(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem)}))},end:function(){return this.prevObject||this.constructor(null)},push:core_push,sort:[].sort,splice:[].splice};jQuery.fn.init.prototype=jQuery.fn;jQuery.extend=jQuery.fn.extend=function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false;if(typeof target==="boolean"){deep=target;target=arguments[1]||{};i=2}if(typeof target!=="object"&&!jQuery.isFunction(target)){target={}}if(length===i){target=this;--i}for(;i<length;i++){if((options=arguments[i])!=null){for(name in options){src=target[name];copy=options[name];if(target===copy){continue}if(deep&&copy&&(jQuery.isPlainObject(copy)||(copyIsArray=jQuery.isArray(copy)))){if(copyIsArray){copyIsArray=false;clone=src&&jQuery.isArray(src)?src:[]}else{clone=src&&jQuery.isPlainObject(src)?src:{}}target[name]=jQuery.extend(deep,clone,copy)}else if(copy!==undefined){target[name]=copy}}}}return target};jQuery.extend({noConflict:function(deep){if(window.$===jQuery){window.$=_$}if(deep&&window.jQuery===jQuery){window.jQuery=_jQuery}return jQuery},isReady:false,readyWait:1,holdReady:function(hold){if(hold){jQuery.readyWait++}else{jQuery.ready(true)}},ready:function(wait){if(wait===true?--jQuery.readyWait:jQuery.isReady){return}if(!document.body){return setTimeout(jQuery.ready,1)}jQuery.isReady=true;if(wait!==true&&--jQuery.readyWait>0){return}readyList.resolveWith(document,[jQuery]);if(jQuery.fn.trigger){jQuery(document).trigger("ready").off("ready")}},isFunction:function(obj){return jQuery.type(obj)==="function"},isArray:Array.isArray||function(obj){return jQuery.type(obj)==="array"},isWindow:function(obj){return obj!=null&&obj==obj.window},isNumeric:function(obj){return!isNaN(parseFloat(obj))&&isFinite(obj)},type:function(obj){return obj==null?String(obj):class2type[core_toString.call(obj)]||"object"},isPlainObject:function(obj){if(!obj||jQuery.type(obj)!=="object"||obj.nodeType||jQuery.isWindow(obj)){return false}try{if(obj.constructor&&!core_hasOwn.call(obj,"constructor")&&!core_hasOwn.call(obj.constructor.prototype,"isPrototypeOf")){return false}}catch(e){return false}var key;for(key in obj){}return key===undefined||core_hasOwn.call(obj,key)},isEmptyObject:function(obj){var name;for(name in obj){return false}return true},error:function(msg){throw new Error(msg)},parseHTML:function(data,context,scripts){var parsed;if(!data||typeof data!=="string"){return null}if(typeof context==="boolean"){scripts=context;context=0}context=context||document;if(parsed=rsingleTag.exec(data)){return[context.createElement(parsed[1])]}parsed=jQuery.buildFragment([data],context,scripts?null:[]);return jQuery.merge([],(parsed.cacheable?jQuery.clone(parsed.fragment):parsed.fragment).childNodes)},parseJSON:function(data){if(!data||typeof data!=="string"){return null}data=jQuery.trim(data);if(window.JSON&&window.JSON.parse){return window.JSON.parse(data)}if(rvalidchars.test(data.replace(rvalidescape,"@").replace(rvalidtokens,"]").replace(rvalidbraces,""))){return new Function("return "+data)()}jQuery.error("Invalid JSON: "+data)},parseXML:function(data){var xml,tmp;if(!data||typeof data!=="string"){return null}try{if(window.DOMParser){tmp=new DOMParser;xml=tmp.parseFromString(data,"text/xml")}else{xml=new ActiveXObject("Microsoft.XMLDOM");xml.async="false";xml.loadXML(data)}}catch(e){xml=undefined}if(!xml||!xml.documentElement||xml.getElementsByTagName("parsererror").length){jQuery.error("Invalid XML: "+data)}return xml},noop:function(){},globalEval:function(data){if(data&&core_rnotwhite.test(data)){(window.execScript||function(data){window["eval"].call(window,data)})(data)}},camelCase:function(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase)},nodeName:function(elem,name){return elem.nodeName&&elem.nodeName.toLowerCase()===name.toLowerCase()},each:function(obj,callback,args){var name,i=0,length=obj.length,isObj=length===undefined||jQuery.isFunction(obj);if(args){if(isObj){for(name in obj){if(callback.apply(obj[name],args)===false){break}}}else{for(;i<length;){if(callback.apply(obj[i++],args)===false){break}}}}else{if(isObj){for(name in obj){if(callback.call(obj[name],name,obj[name])===false){break}}}else{for(;i<length;){if(callback.call(obj[i],i,obj[i++])===false){break}}}}return obj},trim:core_trim&&!core_trim.call("﻿ ")?function(text){return text==null?"":core_trim.call(text)}:function(text){return text==null?"":(text+"").replace(rtrim,"")},makeArray:function(arr,results){var type,ret=results||[];if(arr!=null){type=jQuery.type(arr);if(arr.length==null||type==="string"||type==="function"||type==="regexp"||jQuery.isWindow(arr)){core_push.call(ret,arr)}else{jQuery.merge(ret,arr)}}return ret},inArray:function(elem,arr,i){var len;if(arr){if(core_indexOf){return core_indexOf.call(arr,elem,i)}len=arr.length;i=i?i<0?Math.max(0,len+i):i:0;for(;i<len;i++){if(i in arr&&arr[i]===elem){return i}}}return-1},merge:function(first,second){var l=second.length,i=first.length,j=0;if(typeof l==="number"){for(;j<l;j++){first[i++]=second[j]}}else{while(second[j]!==undefined){first[i++]=second[j++]}}first.length=i;return first},grep:function(elems,callback,inv){var retVal,ret=[],i=0,length=elems.length;inv=!!inv;for(;i<length;i++){retVal=!!callback(elems[i],i);if(inv!==retVal){ret.push(elems[i])}}return ret},map:function(elems,callback,arg){var value,key,ret=[],i=0,length=elems.length,isArray=elems instanceof jQuery||length!==undefined&&typeof length==="number"&&(length>0&&elems[0]&&elems[length-1]||length===0||jQuery.isArray(elems));if(isArray){for(;i<length;i++){value=callback(elems[i],i,arg);if(value!=null){ret[ret.length]=value}}}else{for(key in elems){value=callback(elems[key],key,arg);if(value!=null){ret[ret.length]=value}}}return ret.concat.apply([],ret)},guid:1,proxy:function(fn,context){var tmp,args,proxy;if(typeof context==="string"){tmp=fn[context];context=fn;fn=tmp}if(!jQuery.isFunction(fn)){return undefined}args=core_slice.call(arguments,2);proxy=function(){return fn.apply(context,args.concat(core_slice.call(arguments)))};proxy.guid=fn.guid=fn.guid||jQuery.guid++;return proxy},access:function(elems,fn,key,value,chainable,emptyGet,pass){var exec,bulk=key==null,i=0,length=elems.length;if(key&&typeof key==="object"){for(i in key){jQuery.access(elems,fn,i,key[i],1,emptyGet,value)}chainable=1}else if(value!==undefined){exec=pass===undefined&&jQuery.isFunction(value);if(bulk){if(exec){exec=fn;fn=function(elem,key,value){return exec.call(jQuery(elem),value)}}else{fn.call(elems,value);fn=null}}if(fn){for(;i<length;i++){fn(elems[i],key,exec?value.call(elems[i],i,fn(elems[i],key)):value,pass)}}chainable=1}return chainable?elems:bulk?fn.call(elems):length?fn(elems[0],key):emptyGet},now:function(){return(new Date).getTime()}});jQuery.ready.promise=function(obj){if(!readyList){readyList=jQuery.Deferred();if(document.readyState==="complete"){setTimeout(jQuery.ready,1)}else if(document.addEventListener){document.addEventListener("DOMContentLoaded",DOMContentLoaded,false);window.addEventListener("load",jQuery.ready,false)}else{document.attachEvent("onreadystatechange",DOMContentLoaded);window.attachEvent("onload",jQuery.ready);var top=false;try{top=window.frameElement==null&&document.documentElement}catch(e){}if(top&&top.doScroll){(function doScrollCheck(){if(!jQuery.isReady){try{top.doScroll("left")}catch(e){return setTimeout(doScrollCheck,50)}jQuery.ready()}})()}}}return readyList.promise(obj)};jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(i,name){class2type["[object "+name+"]"]=name.toLowerCase()});rootjQuery=jQuery(document);var optionsCache={};function createOptions(options){var object=optionsCache[options]={};jQuery.each(options.split(core_rspace),function(_,flag){object[flag]=true});return object}jQuery.Callbacks=function(options){options=typeof options==="string"?optionsCache[options]||createOptions(options):jQuery.extend({},options);var memory,fired,firing,firingStart,firingLength,firingIndex,list=[],stack=!options.once&&[],fire=function(data){memory=options.memory&&data;fired=true;firingIndex=firingStart||0;firingStart=0;firingLength=list.length;firing=true;for(;list&&firingIndex<firingLength;firingIndex++){if(list[firingIndex].apply(data[0],data[1])===false&&options.stopOnFalse){memory=false;break}}firing=false;if(list){if(stack){if(stack.length){fire(stack.shift())}}else if(memory){list=[]}else{self.disable()}}},self={add:function(){if(list){var start=list.length;(function add(args){jQuery.each(args,function(_,arg){var type=jQuery.type(arg);if(type==="function"){if(!options.unique||!self.has(arg)){list.push(arg)}}else if(arg&&arg.length&&type!=="string"){add(arg)}})})(arguments);if(firing){firingLength=list.length}else if(memory){firingStart=start;fire(memory)}}return this},remove:function(){if(list){jQuery.each(arguments,function(_,arg){var index;while((index=jQuery.inArray(arg,list,index))>-1){list.splice(index,1);if(firing){if(index<=firingLength){firingLength--}if(index<=firingIndex){firingIndex--}}}})}return this},has:function(fn){return jQuery.inArray(fn,list)>-1},empty:function(){list=[];return this},disable:function(){list=stack=memory=undefined;return this},disabled:function(){return!list},lock:function(){stack=undefined;if(!memory){self.disable()}return this},locked:function(){return!stack},fireWith:function(context,args){args=args||[];args=[context,args.slice?args.slice():args];if(list&&(!fired||stack)){if(firing){stack.push(args)}else{fire(args)}}return this},fire:function(){self.fireWith(this,arguments);return this},fired:function(){return!!fired}};return self};jQuery.extend({Deferred:function(func){var tuples=[["resolve","done",jQuery.Callbacks("once memory"),"resolved"],["reject","fail",jQuery.Callbacks("once memory"),"rejected"],["notify","progress",jQuery.Callbacks("memory")]],state="pending",promise={state:function(){return state},always:function(){deferred.done(arguments).fail(arguments);return this},then:function(){var fns=arguments;return jQuery.Deferred(function(newDefer){jQuery.each(tuples,function(i,tuple){var action=tuple[0],fn=fns[i];deferred[tuple[1]](jQuery.isFunction(fn)?function(){var returned=fn.apply(this,arguments);if(returned&&jQuery.isFunction(returned.promise)){returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify)}else{newDefer[action+"With"](this===deferred?newDefer:this,[returned])}}:newDefer[action])});fns=null}).promise()},promise:function(obj){return obj!=null?jQuery.extend(obj,promise):promise}},deferred={};promise.pipe=promise.then;jQuery.each(tuples,function(i,tuple){var list=tuple[2],stateString=tuple[3];promise[tuple[1]]=list.add;if(stateString){list.add(function(){state=stateString},tuples[i^1][2].disable,tuples[2][2].lock)}deferred[tuple[0]]=list.fire;deferred[tuple[0]+"With"]=list.fireWith});promise.promise(deferred);if(func){func.call(deferred,deferred)}return deferred},when:function(subordinate){var i=0,resolveValues=core_slice.call(arguments),length=resolveValues.length,remaining=length!==1||subordinate&&jQuery.isFunction(subordinate.promise)?length:0,deferred=remaining===1?subordinate:jQuery.Deferred(),updateFunc=function(i,contexts,values){return function(value){contexts[i]=this;values[i]=arguments.length>1?core_slice.call(arguments):value;if(values===progressValues){deferred.notifyWith(contexts,values)}else if(!--remaining){deferred.resolveWith(contexts,values)}}},progressValues,progressContexts,resolveContexts;if(length>1){progressValues=new Array(length);progressContexts=new Array(length);resolveContexts=new Array(length);for(;i<length;i++){if(resolveValues[i]&&jQuery.isFunction(resolveValues[i].promise)){resolveValues[i].promise().done(updateFunc(i,resolveContexts,resolveValues)).fail(deferred.reject).progress(updateFunc(i,progressContexts,progressValues))}else{--remaining}}}if(!remaining){deferred.resolveWith(resolveContexts,resolveValues)}return deferred.promise()}});jQuery.support=function(){var support,all,a,select,opt,input,fragment,eventName,i,isSupported,clickFn,div=document.createElement("div");div.setAttribute("className","t");div.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";all=div.getElementsByTagName("*");a=div.getElementsByTagName("a")[0];if(!all||!a||!all.length){return{}}select=document.createElement("select");opt=select.appendChild(document.createElement("option"));input=div.getElementsByTagName("input")[0];a.style.cssText="top:1px;float:left;opacity:.5";support={leadingWhitespace:div.firstChild.nodeType===3,tbody:!div.getElementsByTagName("tbody").length,htmlSerialize:!!div.getElementsByTagName("link").length,style:/top/.test(a.getAttribute("style")),hrefNormalized:a.getAttribute("href")==="/a",opacity:/^0.5/.test(a.style.opacity),cssFloat:!!a.style.cssFloat,checkOn:input.value==="on",optSelected:opt.selected,getSetAttribute:div.className!=="t",enctype:!!document.createElement("form").enctype,html5Clone:document.createElement("nav").cloneNode(true).outerHTML!=="<:nav></:nav>",boxModel:document.compatMode==="CSS1Compat",submitBubbles:true,changeBubbles:true,focusinBubbles:false,deleteExpando:true,noCloneEvent:true,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableMarginRight:true,boxSizingReliable:true,pixelPosition:false};input.checked=true;support.noCloneChecked=input.cloneNode(true).checked;select.disabled=true;support.optDisabled=!opt.disabled;try{delete div.test}catch(e){support.deleteExpando=false}if(!div.addEventListener&&div.attachEvent&&div.fireEvent){div.attachEvent("onclick",clickFn=function(){support.noCloneEvent=false});div.cloneNode(true).fireEvent("onclick");div.detachEvent("onclick",clickFn)}input=document.createElement("input");input.value="t";input.setAttribute("type","radio");support.radioValue=input.value==="t";input.setAttribute("checked","checked");input.setAttribute("name","t");div.appendChild(input);fragment=document.createDocumentFragment();fragment.appendChild(div.lastChild);support.checkClone=fragment.cloneNode(true).cloneNode(true).lastChild.checked;support.appendChecked=input.checked;fragment.removeChild(input);fragment.appendChild(div);if(div.attachEvent){for(i in{submit:true,change:true,focusin:true}){eventName="on"+i;isSupported=eventName in div;if(!isSupported){div.setAttribute(eventName,"return;");isSupported=typeof div[eventName]==="function"}support[i+"Bubbles"]=isSupported}}jQuery(function(){var container,div,tds,marginDiv,divReset="padding:0;margin:0;border:0;display:block;overflow:hidden;",body=document.getElementsByTagName("body")[0];if(!body){return}container=document.createElement("div");container.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";body.insertBefore(container,body.firstChild);div=document.createElement("div");container.appendChild(div);div.innerHTML="<table><tr><td></td><td>t</td></tr></table>";tds=div.getElementsByTagName("td");tds[0].style.cssText="padding:0;margin:0;border:0;display:none";isSupported=tds[0].offsetHeight===0;tds[0].style.display="";tds[1].style.display="none";support.reliableHiddenOffsets=isSupported&&tds[0].offsetHeight===0;div.innerHTML="";div.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";support.boxSizing=div.offsetWidth===4;support.doesNotIncludeMarginInBodyOffset=body.offsetTop!==1;if(window.getComputedStyle){support.pixelPosition=(window.getComputedStyle(div,null)||{}).top!=="1%";support.boxSizingReliable=(window.getComputedStyle(div,null)||{width:"4px"}).width==="4px";marginDiv=document.createElement("div");marginDiv.style.cssText=div.style.cssText=divReset;marginDiv.style.marginRight=marginDiv.style.width="0";div.style.width="1px";div.appendChild(marginDiv);support.reliableMarginRight=!parseFloat((window.getComputedStyle(marginDiv,null)||{}).marginRight)}if(typeof div.style.zoom!=="undefined"){div.innerHTML="";div.style.cssText=divReset+"width:1px;padding:1px;display:inline;zoom:1";support.inlineBlockNeedsLayout=div.offsetWidth===3;div.style.display="block";div.style.overflow="visible";div.innerHTML="<div></div>";div.firstChild.style.width="5px";support.shrinkWrapBlocks=div.offsetWidth!==3;container.style.zoom=1}body.removeChild(container);container=div=tds=marginDiv=null});fragment.removeChild(div);all=a=select=opt=input=fragment=div=null;return support}();var rbrace=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,rmultiDash=/([A-Z])/g;jQuery.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(jQuery.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:true,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:true},hasData:function(elem){elem=elem.nodeType?jQuery.cache[elem[jQuery.expando]]:elem[jQuery.expando];return!!elem&&!isEmptyDataObject(elem)},data:function(elem,name,data,pvt){if(!jQuery.acceptData(elem)){return}var thisCache,ret,internalKey=jQuery.expando,getByName=typeof name==="string",isNode=elem.nodeType,cache=isNode?jQuery.cache:elem,id=isNode?elem[internalKey]:elem[internalKey]&&internalKey;if((!id||!cache[id]||!pvt&&!cache[id].data)&&getByName&&data===undefined){return}if(!id){if(isNode){elem[internalKey]=id=jQuery.deletedIds.pop()||jQuery.guid++}else{id=internalKey}}if(!cache[id]){cache[id]={};if(!isNode){cache[id].toJSON=jQuery.noop}}if(typeof name==="object"||typeof name==="function"){if(pvt){cache[id]=jQuery.extend(cache[id],name)}else{cache[id].data=jQuery.extend(cache[id].data,name)}}thisCache=cache[id];if(!pvt){if(!thisCache.data){thisCache.data={}}thisCache=thisCache.data}if(data!==undefined){thisCache[jQuery.camelCase(name)]=data}if(getByName){ret=thisCache[name];if(ret==null){ret=thisCache[jQuery.camelCase(name)]}}else{ret=thisCache}return ret},removeData:function(elem,name,pvt){if(!jQuery.acceptData(elem)){return}var thisCache,i,l,isNode=elem.nodeType,cache=isNode?jQuery.cache:elem,id=isNode?elem[jQuery.expando]:jQuery.expando;if(!cache[id]){return}if(name){thisCache=pvt?cache[id]:cache[id].data;if(thisCache){if(!jQuery.isArray(name)){if(name in thisCache){name=[name]}else{name=jQuery.camelCase(name);if(name in thisCache){name=[name]}else{name=name.split(" ")}}}for(i=0,l=name.length;i<l;i++){delete thisCache[name[i]]}if(!(pvt?isEmptyDataObject:jQuery.isEmptyObject)(thisCache)){return}}}if(!pvt){delete cache[id].data;if(!isEmptyDataObject(cache[id])){return}}if(isNode){jQuery.cleanData([elem],true)}else if(jQuery.support.deleteExpando||cache!=cache.window){delete cache[id]}else{cache[id]=null}},_data:function(elem,name,data){return jQuery.data(elem,name,data,true)},acceptData:function(elem){var noData=elem.nodeName&&jQuery.noData[elem.nodeName.toLowerCase()];return!noData||noData!==true&&elem.getAttribute("classid")===noData}});jQuery.fn.extend({data:function(key,value){var parts,part,attr,name,l,elem=this[0],i=0,data=null;if(key===undefined){if(this.length){data=jQuery.data(elem);if(elem.nodeType===1&&!jQuery._data(elem,"parsedAttrs")){attr=elem.attributes;for(l=attr.length;i<l;i++){name=attr[i].name;if(!name.indexOf("data-")){name=jQuery.camelCase(name.substring(5));dataAttr(elem,name,data[name])}}jQuery._data(elem,"parsedAttrs",true)}}return data}if(typeof key==="object"){return this.each(function(){jQuery.data(this,key)})}parts=key.split(".",2);parts[1]=parts[1]?"."+parts[1]:"";part=parts[1]+"!";return jQuery.access(this,function(value){if(value===undefined){data=this.triggerHandler("getData"+part,[parts[0]]);if(data===undefined&&elem){data=jQuery.data(elem,key);data=dataAttr(elem,key,data)}return data===undefined&&parts[1]?this.data(parts[0]):data}parts[1]=value;this.each(function(){var self=jQuery(this);self.triggerHandler("setData"+part,parts);jQuery.data(this,key,value);self.triggerHandler("changeData"+part,parts)})},null,value,arguments.length>1,null,false)},removeData:function(key){return this.each(function(){jQuery.removeData(this,key)})}});function dataAttr(elem,key,data){if(data===undefined&&elem.nodeType===1){var name="data-"+key.replace(rmultiDash,"-$1").toLowerCase();data=elem.getAttribute(name);if(typeof data==="string"){try{data=data==="true"?true:data==="false"?false:data==="null"?null:+data+""===data?+data:rbrace.test(data)?jQuery.parseJSON(data):data}catch(e){}jQuery.data(elem,key,data)}else{data=undefined}}return data}function isEmptyDataObject(obj){var name;for(name in obj){if(name==="data"&&jQuery.isEmptyObject(obj[name])){continue}if(name!=="toJSON"){return false}}return true}jQuery.extend({queue:function(elem,type,data){var queue;if(elem){type=(type||"fx")+"queue";queue=jQuery._data(elem,type);if(data){if(!queue||jQuery.isArray(data)){queue=jQuery._data(elem,type,jQuery.makeArray(data))}else{queue.push(data)}}return queue||[]}},dequeue:function(elem,type){type=type||"fx";var queue=jQuery.queue(elem,type),startLength=queue.length,fn=queue.shift(),hooks=jQuery._queueHooks(elem,type),next=function(){jQuery.dequeue(elem,type)};if(fn==="inprogress"){fn=queue.shift();startLength--}if(fn){if(type==="fx"){queue.unshift("inprogress")}delete hooks.stop;fn.call(elem,next,hooks)}if(!startLength&&hooks){hooks.empty.fire()}},_queueHooks:function(elem,type){var key=type+"queueHooks";return jQuery._data(elem,key)||jQuery._data(elem,key,{empty:jQuery.Callbacks("once memory").add(function(){jQuery.removeData(elem,type+"queue",true);jQuery.removeData(elem,key,true)})})}});jQuery.fn.extend({queue:function(type,data){var setter=2;if(typeof type!=="string"){data=type;type="fx";setter--}if(arguments.length<setter){return jQuery.queue(this[0],type)}return data===undefined?this:this.each(function(){var queue=jQuery.queue(this,type,data);jQuery._queueHooks(this,type);if(type==="fx"&&queue[0]!=="inprogress"){jQuery.dequeue(this,type)}})},dequeue:function(type){return this.each(function(){jQuery.dequeue(this,type)})},delay:function(time,type){time=jQuery.fx?jQuery.fx.speeds[time]||time:time;type=type||"fx";return this.queue(type,function(next,hooks){var timeout=setTimeout(next,time);hooks.stop=function(){clearTimeout(timeout)}})},clearQueue:function(type){return this.queue(type||"fx",[])},promise:function(type,obj){var tmp,count=1,defer=jQuery.Deferred(),elements=this,i=this.length,resolve=function(){if(!--count){defer.resolveWith(elements,[elements])}};if(typeof type!=="string"){obj=type;type=undefined}type=type||"fx";while(i--){tmp=jQuery._data(elements[i],type+"queueHooks");if(tmp&&tmp.empty){count++;tmp.empty.add(resolve)}}resolve();return defer.promise(obj)}});var nodeHook,boolHook,fixSpecified,rclass=/[\t\r\n]/g,rreturn=/\r/g,rtype=/^(?:button|input)$/i,rfocusable=/^(?:button|input|object|select|textarea)$/i,rclickable=/^a(?:rea|)$/i,rboolean=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,getSetAttribute=jQuery.support.getSetAttribute;jQuery.fn.extend({attr:function(name,value){return jQuery.access(this,jQuery.attr,name,value,arguments.length>1)},removeAttr:function(name){return this.each(function(){jQuery.removeAttr(this,name)})},prop:function(name,value){return jQuery.access(this,jQuery.prop,name,value,arguments.length>1)},removeProp:function(name){name=jQuery.propFix[name]||name;return this.each(function(){try{this[name]=undefined;delete this[name]}catch(e){}})},addClass:function(value){var classNames,i,l,elem,setClass,c,cl;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).addClass(value.call(this,j,this.className))})}if(value&&typeof value==="string"){classNames=value.split(core_rspace);for(i=0,l=this.length;i<l;i++){elem=this[i];if(elem.nodeType===1){if(!elem.className&&classNames.length===1){elem.className=value}else{setClass=" "+elem.className+" ";for(c=0,cl=classNames.length;c<cl;c++){if(setClass.indexOf(" "+classNames[c]+" ")<0){setClass+=classNames[c]+" "}}elem.className=jQuery.trim(setClass)}}}}return this},removeClass:function(value){var removes,className,elem,c,cl,i,l;if(jQuery.isFunction(value)){return this.each(function(j){jQuery(this).removeClass(value.call(this,j,this.className))})}if(value&&typeof value==="string"||value===undefined){removes=(value||"").split(core_rspace);for(i=0,l=this.length;i<l;i++){elem=this[i];if(elem.nodeType===1&&elem.className){className=(" "+elem.className+" ").replace(rclass," ");for(c=0,cl=removes.length;c<cl;c++){while(className.indexOf(" "+removes[c]+" ")>=0){className=className.replace(" "+removes[c]+" "," ")}}elem.className=value?jQuery.trim(className):""}}}return this},toggleClass:function(value,stateVal){var type=typeof value,isBool=typeof stateVal==="boolean";if(jQuery.isFunction(value)){return this.each(function(i){jQuery(this).toggleClass(value.call(this,i,this.className,stateVal),stateVal)})}return this.each(function(){if(type==="string"){var className,i=0,self=jQuery(this),state=stateVal,classNames=value.split(core_rspace);while(className=classNames[i++]){state=isBool?state:!self.hasClass(className);self[state?"addClass":"removeClass"](className)}}else if(type==="undefined"||type==="boolean"){if(this.className){jQuery._data(this,"__className__",this.className)}this.className=this.className||value===false?"":jQuery._data(this,"__className__")||""}})},hasClass:function(selector){var className=" "+selector+" ",i=0,l=this.length;for(;i<l;i++){if(this[i].nodeType===1&&(" "+this[i].className+" ").replace(rclass," ").indexOf(className)>=0){return true}}return false},val:function(value){var hooks,ret,isFunction,elem=this[0];if(!arguments.length){if(elem){hooks=jQuery.valHooks[elem.type]||jQuery.valHooks[elem.nodeName.toLowerCase()];if(hooks&&"get"in hooks&&(ret=hooks.get(elem,"value"))!==undefined){return ret}ret=elem.value;return typeof ret==="string"?ret.replace(rreturn,""):ret==null?"":ret}return}isFunction=jQuery.isFunction(value);return this.each(function(i){var val,self=jQuery(this);if(this.nodeType!==1){return}if(isFunction){val=value.call(this,i,self.val())}else{val=value}if(val==null){val=""}else if(typeof val==="number"){val+=""}else if(jQuery.isArray(val)){val=jQuery.map(val,function(value){return value==null?"":value+""})}hooks=jQuery.valHooks[this.type]||jQuery.valHooks[this.nodeName.toLowerCase()];if(!hooks||!("set"in hooks)||hooks.set(this,val,"value")===undefined){this.value=val}})}});jQuery.extend({valHooks:{option:{get:function(elem){var val=elem.attributes.value;return!val||val.specified?elem.value:elem.text}},select:{get:function(elem){var value,option,options=elem.options,index=elem.selectedIndex,one=elem.type==="select-one"||index<0,values=one?null:[],max=one?index+1:options.length,i=index<0?max:one?index:0;for(;i<max;i++){option=options[i];if((option.selected||i===index)&&(jQuery.support.optDisabled?!option.disabled:option.getAttribute("disabled")===null)&&(!option.parentNode.disabled||!jQuery.nodeName(option.parentNode,"optgroup"))){value=jQuery(option).val();if(one){return value}values.push(value)}}return values},set:function(elem,value){var values=jQuery.makeArray(value);jQuery(elem).find("option").each(function(){this.selected=jQuery.inArray(jQuery(this).val(),values)>=0});if(!values.length){elem.selectedIndex=-1}return values}}},attrFn:{},attr:function(elem,name,value,pass){var ret,hooks,notxml,nType=elem.nodeType;if(!elem||nType===3||nType===8||nType===2){return}if(pass&&jQuery.isFunction(jQuery.fn[name])){return jQuery(elem)[name](value)}if(typeof elem.getAttribute==="undefined"){return jQuery.prop(elem,name,value)}notxml=nType!==1||!jQuery.isXMLDoc(elem);if(notxml){name=name.toLowerCase();hooks=jQuery.attrHooks[name]||(rboolean.test(name)?boolHook:nodeHook)}if(value!==undefined){if(value===null){jQuery.removeAttr(elem,name);return}else if(hooks&&"set"in hooks&&notxml&&(ret=hooks.set(elem,value,name))!==undefined){return ret}else{elem.setAttribute(name,value+"");return value}}else if(hooks&&"get"in hooks&&notxml&&(ret=hooks.get(elem,name))!==null){return ret}else{ret=elem.getAttribute(name);return ret===null?undefined:ret}},removeAttr:function(elem,value){var propName,attrNames,name,isBool,i=0;if(value&&elem.nodeType===1){attrNames=value.split(core_rspace);for(;i<attrNames.length;i++){name=attrNames[i];if(name){propName=jQuery.propFix[name]||name;isBool=rboolean.test(name);if(!isBool){jQuery.attr(elem,name,"")}elem.removeAttribute(getSetAttribute?name:propName);if(isBool&&propName in elem){elem[propName]=false}}}}},attrHooks:{type:{set:function(elem,value){if(rtype.test(elem.nodeName)&&elem.parentNode){jQuery.error("type property can't be changed")
}else if(!jQuery.support.radioValue&&value==="radio"&&jQuery.nodeName(elem,"input")){var val=elem.value;elem.setAttribute("type",value);if(val){elem.value=val}return value}}},value:{get:function(elem,name){if(nodeHook&&jQuery.nodeName(elem,"button")){return nodeHook.get(elem,name)}return name in elem?elem.value:null},set:function(elem,value,name){if(nodeHook&&jQuery.nodeName(elem,"button")){return nodeHook.set(elem,value,name)}elem.value=value}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(elem,name,value){var ret,hooks,notxml,nType=elem.nodeType;if(!elem||nType===3||nType===8||nType===2){return}notxml=nType!==1||!jQuery.isXMLDoc(elem);if(notxml){name=jQuery.propFix[name]||name;hooks=jQuery.propHooks[name]}if(value!==undefined){if(hooks&&"set"in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret}else{return elem[name]=value}}else{if(hooks&&"get"in hooks&&(ret=hooks.get(elem,name))!==null){return ret}else{return elem[name]}}},propHooks:{tabIndex:{get:function(elem){var attributeNode=elem.getAttributeNode("tabindex");return attributeNode&&attributeNode.specified?parseInt(attributeNode.value,10):rfocusable.test(elem.nodeName)||rclickable.test(elem.nodeName)&&elem.href?0:undefined}}}});boolHook={get:function(elem,name){var attrNode,property=jQuery.prop(elem,name);return property===true||typeof property!=="boolean"&&(attrNode=elem.getAttributeNode(name))&&attrNode.nodeValue!==false?name.toLowerCase():undefined},set:function(elem,value,name){var propName;if(value===false){jQuery.removeAttr(elem,name)}else{propName=jQuery.propFix[name]||name;if(propName in elem){elem[propName]=true}elem.setAttribute(name,name.toLowerCase())}return name}};if(!getSetAttribute){fixSpecified={name:true,id:true,coords:true};nodeHook=jQuery.valHooks.button={get:function(elem,name){var ret;ret=elem.getAttributeNode(name);return ret&&(fixSpecified[name]?ret.value!=="":ret.specified)?ret.value:undefined},set:function(elem,value,name){var ret=elem.getAttributeNode(name);if(!ret){ret=document.createAttribute(name);elem.setAttributeNode(ret)}return ret.value=value+""}};jQuery.each(["width","height"],function(i,name){jQuery.attrHooks[name]=jQuery.extend(jQuery.attrHooks[name],{set:function(elem,value){if(value===""){elem.setAttribute(name,"auto");return value}}})});jQuery.attrHooks.contenteditable={get:nodeHook.get,set:function(elem,value,name){if(value===""){value="false"}nodeHook.set(elem,value,name)}}}if(!jQuery.support.hrefNormalized){jQuery.each(["href","src","width","height"],function(i,name){jQuery.attrHooks[name]=jQuery.extend(jQuery.attrHooks[name],{get:function(elem){var ret=elem.getAttribute(name,2);return ret===null?undefined:ret}})})}if(!jQuery.support.style){jQuery.attrHooks.style={get:function(elem){return elem.style.cssText.toLowerCase()||undefined},set:function(elem,value){return elem.style.cssText=value+""}}}if(!jQuery.support.optSelected){jQuery.propHooks.selected=jQuery.extend(jQuery.propHooks.selected,{get:function(elem){var parent=elem.parentNode;if(parent){parent.selectedIndex;if(parent.parentNode){parent.parentNode.selectedIndex}}return null}})}if(!jQuery.support.enctype){jQuery.propFix.enctype="encoding"}if(!jQuery.support.checkOn){jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]={get:function(elem){return elem.getAttribute("value")===null?"on":elem.value}}})}jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]=jQuery.extend(jQuery.valHooks[this],{set:function(elem,value){if(jQuery.isArray(value)){return elem.checked=jQuery.inArray(jQuery(elem).val(),value)>=0}}})});var rformElems=/^(?:textarea|input|select)$/i,rtypenamespace=/^([^\.]*|)(?:\.(.+)|)$/,rhoverHack=/(?:^|\s)hover(\.\S+|)\b/,rkeyEvent=/^key/,rmouseEvent=/^(?:mouse|contextmenu)|click/,rfocusMorph=/^(?:focusinfocus|focusoutblur)$/,hoverHack=function(events){return jQuery.event.special.hover?events:events.replace(rhoverHack,"mouseenter$1 mouseleave$1")};jQuery.event={add:function(elem,types,handler,data,selector){var elemData,eventHandle,events,t,tns,type,namespaces,handleObj,handleObjIn,handlers,special;if(elem.nodeType===3||elem.nodeType===8||!types||!handler||!(elemData=jQuery._data(elem))){return}if(handler.handler){handleObjIn=handler;handler=handleObjIn.handler;selector=handleObjIn.selector}if(!handler.guid){handler.guid=jQuery.guid++}events=elemData.events;if(!events){elemData.events=events={}}eventHandle=elemData.handle;if(!eventHandle){elemData.handle=eventHandle=function(e){return typeof jQuery!=="undefined"&&(!e||jQuery.event.triggered!==e.type)?jQuery.event.dispatch.apply(eventHandle.elem,arguments):undefined};eventHandle.elem=elem}types=jQuery.trim(hoverHack(types)).split(" ");for(t=0;t<types.length;t++){tns=rtypenamespace.exec(types[t])||[];type=tns[1];namespaces=(tns[2]||"").split(".").sort();special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||type;special=jQuery.event.special[type]||{};handleObj=jQuery.extend({type:type,origType:tns[1],data:data,handler:handler,guid:handler.guid,selector:selector,needsContext:selector&&jQuery.expr.match.needsContext.test(selector),namespace:namespaces.join(".")},handleObjIn);handlers=events[type];if(!handlers){handlers=events[type]=[];handlers.delegateCount=0;if(!special.setup||special.setup.call(elem,data,namespaces,eventHandle)===false){if(elem.addEventListener){elem.addEventListener(type,eventHandle,false)}else if(elem.attachEvent){elem.attachEvent("on"+type,eventHandle)}}}if(special.add){special.add.call(elem,handleObj);if(!handleObj.handler.guid){handleObj.handler.guid=handler.guid}}if(selector){handlers.splice(handlers.delegateCount++,0,handleObj)}else{handlers.push(handleObj)}jQuery.event.global[type]=true}elem=null},global:{},remove:function(elem,types,handler,selector,mappedTypes){var t,tns,type,origType,namespaces,origCount,j,events,special,eventType,handleObj,elemData=jQuery.hasData(elem)&&jQuery._data(elem);if(!elemData||!(events=elemData.events)){return}types=jQuery.trim(hoverHack(types||"")).split(" ");for(t=0;t<types.length;t++){tns=rtypenamespace.exec(types[t])||[];type=origType=tns[1];namespaces=tns[2];if(!type){for(type in events){jQuery.event.remove(elem,type+types[t],handler,selector,true)}continue}special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||type;eventType=events[type]||[];origCount=eventType.length;namespaces=namespaces?new RegExp("(^|\\.)"+namespaces.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(j=0;j<eventType.length;j++){handleObj=eventType[j];if((mappedTypes||origType===handleObj.origType)&&(!handler||handler.guid===handleObj.guid)&&(!namespaces||namespaces.test(handleObj.namespace))&&(!selector||selector===handleObj.selector||selector==="**"&&handleObj.selector)){eventType.splice(j--,1);if(handleObj.selector){eventType.delegateCount--}if(special.remove){special.remove.call(elem,handleObj)}}}if(eventType.length===0&&origCount!==eventType.length){if(!special.teardown||special.teardown.call(elem,namespaces,elemData.handle)===false){jQuery.removeEvent(elem,type,elemData.handle)}delete events[type]}}if(jQuery.isEmptyObject(events)){delete elemData.handle;jQuery.removeData(elem,"events",true)}},customEvent:{getData:true,setData:true,changeData:true},trigger:function(event,data,elem,onlyHandlers){if(elem&&(elem.nodeType===3||elem.nodeType===8)){return}var cache,exclusive,i,cur,old,ontype,special,handle,eventPath,bubbleType,type=event.type||event,namespaces=[];if(rfocusMorph.test(type+jQuery.event.triggered)){return}if(type.indexOf("!")>=0){type=type.slice(0,-1);exclusive=true}if(type.indexOf(".")>=0){namespaces=type.split(".");type=namespaces.shift();namespaces.sort()}if((!elem||jQuery.event.customEvent[type])&&!jQuery.event.global[type]){return}event=typeof event==="object"?event[jQuery.expando]?event:new jQuery.Event(type,event):new jQuery.Event(type);event.type=type;event.isTrigger=true;event.exclusive=exclusive;event.namespace=namespaces.join(".");event.namespace_re=event.namespace?new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)"):null;ontype=type.indexOf(":")<0?"on"+type:"";if(!elem){cache=jQuery.cache;for(i in cache){if(cache[i].events&&cache[i].events[type]){jQuery.event.trigger(event,data,cache[i].handle.elem,true)}}return}event.result=undefined;if(!event.target){event.target=elem}data=data!=null?jQuery.makeArray(data):[];data.unshift(event);special=jQuery.event.special[type]||{};if(special.trigger&&special.trigger.apply(elem,data)===false){return}eventPath=[[elem,special.bindType||type]];if(!onlyHandlers&&!special.noBubble&&!jQuery.isWindow(elem)){bubbleType=special.delegateType||type;cur=rfocusMorph.test(bubbleType+type)?elem:elem.parentNode;for(old=elem;cur;cur=cur.parentNode){eventPath.push([cur,bubbleType]);old=cur}if(old===(elem.ownerDocument||document)){eventPath.push([old.defaultView||old.parentWindow||window,bubbleType])}}for(i=0;i<eventPath.length&&!event.isPropagationStopped();i++){cur=eventPath[i][0];event.type=eventPath[i][1];handle=(jQuery._data(cur,"events")||{})[event.type]&&jQuery._data(cur,"handle");if(handle){handle.apply(cur,data)}handle=ontype&&cur[ontype];if(handle&&jQuery.acceptData(cur)&&handle.apply&&handle.apply(cur,data)===false){event.preventDefault()}}event.type=type;if(!onlyHandlers&&!event.isDefaultPrevented()){if((!special._default||special._default.apply(elem.ownerDocument,data)===false)&&!(type==="click"&&jQuery.nodeName(elem,"a"))&&jQuery.acceptData(elem)){if(ontype&&elem[type]&&(type!=="focus"&&type!=="blur"||event.target.offsetWidth!==0)&&!jQuery.isWindow(elem)){old=elem[ontype];if(old){elem[ontype]=null}jQuery.event.triggered=type;elem[type]();jQuery.event.triggered=undefined;if(old){elem[ontype]=old}}}}return event.result},dispatch:function(event){event=jQuery.event.fix(event||window.event);var i,j,cur,ret,selMatch,matched,matches,handleObj,sel,related,handlers=(jQuery._data(this,"events")||{})[event.type]||[],delegateCount=handlers.delegateCount,args=core_slice.call(arguments),run_all=!event.exclusive&&!event.namespace,special=jQuery.event.special[event.type]||{},handlerQueue=[];args[0]=event;event.delegateTarget=this;if(special.preDispatch&&special.preDispatch.call(this,event)===false){return}if(delegateCount&&!(event.button&&event.type==="click")){for(cur=event.target;cur!=this;cur=cur.parentNode||this){if(cur.disabled!==true||event.type!=="click"){selMatch={};matches=[];for(i=0;i<delegateCount;i++){handleObj=handlers[i];sel=handleObj.selector;if(selMatch[sel]===undefined){selMatch[sel]=handleObj.needsContext?jQuery(sel,this).index(cur)>=0:jQuery.find(sel,this,null,[cur]).length}if(selMatch[sel]){matches.push(handleObj)}}if(matches.length){handlerQueue.push({elem:cur,matches:matches})}}}}if(handlers.length>delegateCount){handlerQueue.push({elem:this,matches:handlers.slice(delegateCount)})}for(i=0;i<handlerQueue.length&&!event.isPropagationStopped();i++){matched=handlerQueue[i];event.currentTarget=matched.elem;for(j=0;j<matched.matches.length&&!event.isImmediatePropagationStopped();j++){handleObj=matched.matches[j];if(run_all||!event.namespace&&!handleObj.namespace||event.namespace_re&&event.namespace_re.test(handleObj.namespace)){event.data=handleObj.data;event.handleObj=handleObj;ret=((jQuery.event.special[handleObj.origType]||{}).handle||handleObj.handler).apply(matched.elem,args);if(ret!==undefined){event.result=ret;if(ret===false){event.preventDefault();event.stopPropagation()}}}}}if(special.postDispatch){special.postDispatch.call(this,event)}return event.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(event,original){if(event.which==null){event.which=original.charCode!=null?original.charCode:original.keyCode}return event}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(event,original){var eventDoc,doc,body,button=original.button,fromElement=original.fromElement;if(event.pageX==null&&original.clientX!=null){eventDoc=event.target.ownerDocument||document;doc=eventDoc.documentElement;body=eventDoc.body;event.pageX=original.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);event.pageY=original.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0)}if(!event.relatedTarget&&fromElement){event.relatedTarget=fromElement===event.target?original.toElement:fromElement}if(!event.which&&button!==undefined){event.which=button&1?1:button&2?3:button&4?2:0}return event}},fix:function(event){if(event[jQuery.expando]){return event}var i,prop,originalEvent=event,fixHook=jQuery.event.fixHooks[event.type]||{},copy=fixHook.props?this.props.concat(fixHook.props):this.props;event=jQuery.Event(originalEvent);for(i=copy.length;i;){prop=copy[--i];event[prop]=originalEvent[prop]}if(!event.target){event.target=originalEvent.srcElement||document}if(event.target.nodeType===3){event.target=event.target.parentNode}event.metaKey=!!event.metaKey;return fixHook.filter?fixHook.filter(event,originalEvent):event},special:{load:{noBubble:true},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(data,namespaces,eventHandle){if(jQuery.isWindow(this)){this.onbeforeunload=eventHandle}},teardown:function(namespaces,eventHandle){if(this.onbeforeunload===eventHandle){this.onbeforeunload=null}}}},simulate:function(type,elem,event,bubble){var e=jQuery.extend(new jQuery.Event,event,{type:type,isSimulated:true,originalEvent:{}});if(bubble){jQuery.event.trigger(e,null,elem)}else{jQuery.event.dispatch.call(elem,e)}if(e.isDefaultPrevented()){event.preventDefault()}}};jQuery.event.handle=jQuery.event.dispatch;jQuery.removeEvent=document.removeEventListener?function(elem,type,handle){if(elem.removeEventListener){elem.removeEventListener(type,handle,false)}}:function(elem,type,handle){var name="on"+type;if(elem.detachEvent){if(typeof elem[name]==="undefined"){elem[name]=null}elem.detachEvent(name,handle)}};jQuery.Event=function(src,props){if(!(this instanceof jQuery.Event)){return new jQuery.Event(src,props)}if(src&&src.type){this.originalEvent=src;this.type=src.type;this.isDefaultPrevented=src.defaultPrevented||src.returnValue===false||src.getPreventDefault&&src.getPreventDefault()?returnTrue:returnFalse}else{this.type=src}if(props){jQuery.extend(this,props)}this.timeStamp=src&&src.timeStamp||jQuery.now();this[jQuery.expando]=true};function returnFalse(){return false}function returnTrue(){return true}jQuery.Event.prototype={preventDefault:function(){this.isDefaultPrevented=returnTrue;var e=this.originalEvent;if(!e){return}if(e.preventDefault){e.preventDefault()}else{e.returnValue=false}},stopPropagation:function(){this.isPropagationStopped=returnTrue;var e=this.originalEvent;if(!e){return}if(e.stopPropagation){e.stopPropagation()}e.cancelBubble=true},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=returnTrue;this.stopPropagation()},isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse};jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(orig,fix){jQuery.event.special[orig]={delegateType:fix,bindType:fix,handle:function(event){var ret,target=this,related=event.relatedTarget,handleObj=event.handleObj,selector=handleObj.selector;if(!related||related!==target&&!jQuery.contains(target,related)){event.type=handleObj.origType;ret=handleObj.handler.apply(this,arguments);event.type=fix}return ret}}});if(!jQuery.support.submitBubbles){jQuery.event.special.submit={setup:function(){if(jQuery.nodeName(this,"form")){return false}jQuery.event.add(this,"click._submit keypress._submit",function(e){var elem=e.target,form=jQuery.nodeName(elem,"input")||jQuery.nodeName(elem,"button")?elem.form:undefined;if(form&&!jQuery._data(form,"_submit_attached")){jQuery.event.add(form,"submit._submit",function(event){event._submit_bubble=true});jQuery._data(form,"_submit_attached",true)}})},postDispatch:function(event){if(event._submit_bubble){delete event._submit_bubble;if(this.parentNode&&!event.isTrigger){jQuery.event.simulate("submit",this.parentNode,event,true)}}},teardown:function(){if(jQuery.nodeName(this,"form")){return false}jQuery.event.remove(this,"._submit")}}}if(!jQuery.support.changeBubbles){jQuery.event.special.change={setup:function(){if(rformElems.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio"){jQuery.event.add(this,"propertychange._change",function(event){if(event.originalEvent.propertyName==="checked"){this._just_changed=true}});jQuery.event.add(this,"click._change",function(event){if(this._just_changed&&!event.isTrigger){this._just_changed=false}jQuery.event.simulate("change",this,event,true)})}return false}jQuery.event.add(this,"beforeactivate._change",function(e){var elem=e.target;if(rformElems.test(elem.nodeName)&&!jQuery._data(elem,"_change_attached")){jQuery.event.add(elem,"change._change",function(event){if(this.parentNode&&!event.isSimulated&&!event.isTrigger){jQuery.event.simulate("change",this.parentNode,event,true)}});jQuery._data(elem,"_change_attached",true)}})},handle:function(event){var elem=event.target;if(this!==elem||event.isSimulated||event.isTrigger||elem.type!=="radio"&&elem.type!=="checkbox"){return event.handleObj.handler.apply(this,arguments)}},teardown:function(){jQuery.event.remove(this,"._change");return!rformElems.test(this.nodeName)}}}if(!jQuery.support.focusinBubbles){jQuery.each({focus:"focusin",blur:"focusout"},function(orig,fix){var attaches=0,handler=function(event){jQuery.event.simulate(fix,event.target,jQuery.event.fix(event),true)};jQuery.event.special[fix]={setup:function(){if(attaches++===0){document.addEventListener(orig,handler,true)}},teardown:function(){if(--attaches===0){document.removeEventListener(orig,handler,true)}}}})}jQuery.fn.extend({on:function(types,selector,data,fn,one){var origFn,type;if(typeof types==="object"){if(typeof selector!=="string"){data=data||selector;selector=undefined}for(type in types){this.on(type,selector,data,types[type],one)}return this}if(data==null&&fn==null){fn=selector;data=selector=undefined}else if(fn==null){if(typeof selector==="string"){fn=data;data=undefined}else{fn=data;data=selector;selector=undefined}}if(fn===false){fn=returnFalse}else if(!fn){return this}if(one===1){origFn=fn;fn=function(event){jQuery().off(event);return origFn.apply(this,arguments)};fn.guid=origFn.guid||(origFn.guid=jQuery.guid++)}return this.each(function(){jQuery.event.add(this,types,fn,data,selector)})},one:function(types,selector,data,fn){return this.on(types,selector,data,fn,1)},off:function(types,selector,fn){var handleObj,type;if(types&&types.preventDefault&&types.handleObj){handleObj=types.handleObj;jQuery(types.delegateTarget).off(handleObj.namespace?handleObj.origType+"."+handleObj.namespace:handleObj.origType,handleObj.selector,handleObj.handler);return this}if(typeof types==="object"){for(type in types){this.off(type,selector,types[type])}return this}if(selector===false||typeof selector==="function"){fn=selector;selector=undefined}if(fn===false){fn=returnFalse}return this.each(function(){jQuery.event.remove(this,types,fn,selector)})},bind:function(types,data,fn){return this.on(types,null,data,fn)},unbind:function(types,fn){return this.off(types,null,fn)},live:function(types,data,fn){jQuery(this.context).on(types,this.selector,data,fn);return this},die:function(types,fn){jQuery(this.context).off(types,this.selector||"**",fn);return this},delegate:function(selector,types,data,fn){return this.on(types,selector,data,fn)},undelegate:function(selector,types,fn){return arguments.length===1?this.off(selector,"**"):this.off(types,selector||"**",fn)},trigger:function(type,data){return this.each(function(){jQuery.event.trigger(type,data,this)})},triggerHandler:function(type,data){if(this[0]){return jQuery.event.trigger(type,data,this[0],true)}},toggle:function(fn){var args=arguments,guid=fn.guid||jQuery.guid++,i=0,toggler=function(event){var lastToggle=(jQuery._data(this,"lastToggle"+fn.guid)||0)%i;jQuery._data(this,"lastToggle"+fn.guid,lastToggle+1);event.preventDefault();return args[lastToggle].apply(this,arguments)||false};toggler.guid=guid;while(i<args.length){args[i++].guid=guid}return this.click(toggler)},hover:function(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut||fnOver)}});jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick "+"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "+"change select submit keydown keypress keyup error contextmenu").split(" "),function(i,name){jQuery.fn[name]=function(data,fn){if(fn==null){fn=data;data=null}return arguments.length>0?this.on(name,null,data,fn):this.trigger(name)};if(rkeyEvent.test(name)){jQuery.event.fixHooks[name]=jQuery.event.keyHooks}if(rmouseEvent.test(name)){jQuery.event.fixHooks[name]=jQuery.event.mouseHooks}});(function(window,undefined){var i,cachedruns,Expr,getText,isXML,compile,hasDuplicate,outermostContext,setDocument,document,docElem,documentIsXML,rbuggyQSA,rbuggyMatches,matches,contains,sortOrder,expando="sizzle"+-new Date,strundefined=typeof undefined,MAX_NEGATIVE=1<<31,preferredDoc=window.document,Token=String,dirruns=0,done=0,support={},arr=[],pop=arr.pop,push=arr.push,slice=arr.slice,indexOf=arr.indexOf||function(elem){var i=0,len=this.length;for(;i<len;i++){if(this[i]===elem){return i}}return-1},markFunction=function(fn,value){fn[expando]=value==null||value;return fn},createCache=function(){var cache={},keys=[];return markFunction(function(key,value){if(keys.push(key)>Expr.cacheLength){delete cache[keys.shift()]}return cache[key+" "]=value},cache)},classCache=createCache(),tokenCache=createCache(),compilerCache=createCache(),whitespace="[\\x20\\t\\r\\n\\f]",characterEncoding="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",identifier=characterEncoding.replace("w","w#"),operators="([*^$|!~]?=)",attributes="\\["+whitespace+"*("+characterEncoding+")"+whitespace+"*(?:"+operators+whitespace+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+identifier+")|)|)"+whitespace+"*\\]",pseudos=":("+characterEncoding+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+attributes.replace(3,8)+")*)|.*)\\)|)",rtrim=new RegExp("^"+whitespace+"+|((?:^|[^\\\\])(?:\\\\.)*)"+whitespace+"+$","g"),rcomma=new RegExp("^"+whitespace+"*,"+whitespace+"*"),rcombinators=new RegExp("^"+whitespace+"*([\\x20\\t\\r\\n\\f>+~])"+whitespace+"*"),rpseudo=new RegExp(pseudos),rquickExpr=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,rsibling=/[\x20\t\r\n\f]*[+~]/,rheader=/h\d/i,rinputs=/input|select|textarea|button/i,rnative=/\{\s*\[native code\]\s*\}/,rbackslash=/\\(?!\\)/g,rescape=/'|\\/g,rattributeQuotes=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,matchExpr={ID:new RegExp("^#("+characterEncoding+")"),CLASS:new RegExp("^\\.("+characterEncoding+")"),NAME:new RegExp("^\\[name=['\"]?("+characterEncoding+")['\"]?\\]"),TAG:new RegExp("^("+characterEncoding.replace("w","w*")+")"),ATTR:new RegExp("^"+attributes),PSEUDO:new RegExp("^"+pseudos),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+whitespace+"*(even|odd|(([+-]|)(\\d*)n|)"+whitespace+"*(?:([+-]|)"+whitespace+"*(\\d+)|))"+whitespace+"*\\)|)","i"),needsContext:new RegExp("^"+whitespace+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+whitespace+"*((?:-\\d)?\\d*)"+whitespace+"*\\)|)(?=[^-]|$)","i")},isNative=function(fn){return rnative.test(fn+"")},assert=function(fn){var div=document.createElement("div");try{return fn(div)}catch(e){return false}finally{div=null}};try{slice.call(docElem.childNodes,0)[0].nodeType}catch(e){slice=function(i){var elem,results=[];for(;elem=this[i];i++){results.push(elem)}return results}}function Sizzle(selector,context,results,seed){var match,elem,m,nodeType,i,groups,old,nid,newContext,newSelector;if(context&&(context.ownerDocument||context)!==document){setDocument(context)}context=context||document;results=results||[];if(!selector||typeof selector!=="string"){return results}if((nodeType=context.nodeType)!==1&&nodeType!==9){return[]}if(!documentIsXML&&!seed){if(match=rquickExpr.exec(selector)){if(m=match[1]){if(nodeType===9){elem=context.getElementById(m);if(elem&&elem.parentNode){if(elem.id===m){results.push(elem);return results}}else{return results}}else{if(context.ownerDocument&&(elem=context.ownerDocument.getElementById(m))&&contains(context,elem)&&elem.id===m){results.push(elem);return results}}}else if(match[2]){push.apply(results,slice.call(context.getElementsByTagName(selector),0));return results}else if((m=match[3])&&support.getByClassName&&context.getElementsByClassName){push.apply(results,slice.call(context.getElementsByClassName(m),0));return results}}if(support.qsa&&!rbuggyQSA.test(selector)){old=true;nid=expando;newContext=context;newSelector=nodeType===9&&selector;if(nodeType===1&&context.nodeName.toLowerCase()!=="object"){groups=tokenize(selector);if(old=context.getAttribute("id")){nid=old.replace(rescape,"\\$&")}else{context.setAttribute("id",nid)}nid="[id='"+nid+"'] ";i=groups.length;while(i--){groups[i]=nid+groups[i].join("")}newContext=rsibling.test(selector)&&context.parentNode||context;newSelector=groups.join(",")}if(newSelector){try{push.apply(results,slice.call(newContext.querySelectorAll(newSelector),0));return results}catch(qsaError){}finally{if(!old){context.removeAttribute("id")}}}}}return select(selector.replace(rtrim,"$1"),context,results,seed)}isXML=Sizzle.isXML=function(elem){var documentElement=elem&&(elem.ownerDocument||elem).documentElement;return documentElement?documentElement.nodeName!=="HTML":false};setDocument=Sizzle.setDocument=function(doc){doc=doc&&doc.ownerDocument||doc||window.document;if(!doc||doc.nodeType!==9||!doc.documentElement||document===doc){return document}document=doc;docElem=doc.documentElement;documentIsXML=isXML(doc);support.tagNameNoComments=assert(function(div){div.appendChild(doc.createComment(""));return!div.getElementsByTagName("*").length});support.attributes=assert(function(div){div.innerHTML="<select></select>";var type=typeof div.lastChild.getAttribute("multiple");return type!=="boolean"&&type!=="string"});support.getByClassName=assert(function(div){div.innerHTML="<div class='hidden e'></div><div class='hidden'></div>";if(!div.getElementsByClassName||!div.getElementsByClassName("e").length){return false}div.lastChild.className="e";return div.getElementsByClassName("e").length===2});support.getByName=assert(function(div){div.id=expando+0;div.innerHTML="<a name='"+expando+"'></a><div name='"+expando+"'></div>";docElem.insertBefore(div,docElem.firstChild);var pass=doc.getElementsByName&&doc.getElementsByName(expando).length===2+doc.getElementsByName(expando+0).length;support.getIdNotName=!doc.getElementById(expando);docElem.removeChild(div);return pass});Expr.attrHandle=assert(function(div){div.innerHTML="<a href='#'></a>";return div.firstChild&&typeof div.firstChild.getAttribute!==strundefined&&div.firstChild.getAttribute("href")==="#"})?{}:{href:function(elem){return elem.getAttribute("href",2)},type:function(elem){return elem.getAttribute("type")}};if(support.getIdNotName){Expr.find["ID"]=function(id,context){if(typeof context.getElementById!==strundefined&&!documentIsXML){var m=context.getElementById(id);return m&&m.parentNode?[m]:[]}};Expr.filter["ID"]=function(id){var attrId=id.replace(rbackslash,"");return function(elem){return elem.getAttribute("id")===attrId}}}else{Expr.find["ID"]=function(id,context){if(typeof context.getElementById!==strundefined&&!documentIsXML){var m=context.getElementById(id);return m?m.id===id||typeof m.getAttributeNode!==strundefined&&m.getAttributeNode("id").value===id?[m]:undefined:[]}};Expr.filter["ID"]=function(id){var attrId=id.replace(rbackslash,"");return function(elem){var node=typeof elem.getAttributeNode!==strundefined&&elem.getAttributeNode("id");return node&&node.value===attrId}}}Expr.find["TAG"]=support.tagNameNoComments?function(tag,context){if(typeof context.getElementsByTagName!==strundefined){return context.getElementsByTagName(tag)}}:function(tag,context){var elem,tmp=[],i=0,results=context.getElementsByTagName(tag);if(tag==="*"){for(;elem=results[i];i++){if(elem.nodeType===1){tmp.push(elem)}}return tmp}return results};Expr.find["NAME"]=support.getByName&&function(tag,context){if(typeof context.getElementsByName!==strundefined){return context.getElementsByName(name)}};Expr.find["CLASS"]=support.getByClassName&&function(className,context){if(typeof context.getElementsByClassName!==strundefined&&!documentIsXML){return context.getElementsByClassName(className)}};rbuggyMatches=[];rbuggyQSA=[":focus"];if(support.qsa=isNative(doc.querySelectorAll)){assert(function(div){div.innerHTML="<select><option selected=''></option></select>";if(!div.querySelectorAll("[selected]").length){rbuggyQSA.push("\\["+whitespace+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)")}if(!div.querySelectorAll(":checked").length){rbuggyQSA.push(":checked")}});assert(function(div){div.innerHTML="<p test=''></p>";if(div.querySelectorAll("[test^='']").length){rbuggyQSA.push("[*^$]="+whitespace+"*(?:\"\"|'')")}div.innerHTML="<input type='hidden'/>";if(!div.querySelectorAll(":enabled").length){rbuggyQSA.push(":enabled",":disabled")}div.querySelectorAll("*,:x");rbuggyQSA.push(",.*:")})}if(support.matchesSelector=isNative(matches=docElem.matchesSelector||docElem.mozMatchesSelector||docElem.webkitMatchesSelector||docElem.oMatchesSelector||docElem.msMatchesSelector)){assert(function(div){support.disconnectedMatch=matches.call(div,"div");matches.call(div,"[test!='']:x");rbuggyMatches.push("!=",pseudos)})}rbuggyQSA=new RegExp(rbuggyQSA.join("|"));rbuggyMatches=new RegExp(rbuggyMatches.join("|"));contains=isNative(docElem.contains)||docElem.compareDocumentPosition?function(a,b){var adown=a.nodeType===9?a.documentElement:a,bup=b&&b.parentNode;return a===bup||!!(bup&&bup.nodeType===1&&(adown.contains?adown.contains(bup):a.compareDocumentPosition&&a.compareDocumentPosition(bup)&16))}:function(a,b){if(b){while(b=b.parentNode){if(b===a){return true}}}return false};sortOrder=docElem.compareDocumentPosition?function(a,b){var compare;if(a===b){hasDuplicate=true;return 0}if(compare=b.compareDocumentPosition&&a.compareDocumentPosition&&a.compareDocumentPosition(b)){if(compare&1||a.parentNode&&a.parentNode.nodeType===11){if(a===doc||contains(preferredDoc,a)){return-1}if(b===doc||contains(preferredDoc,b)){return 1}return 0}return compare&4?-1:1}return a.compareDocumentPosition?-1:1}:function(a,b){var cur,i=0,aup=a.parentNode,bup=b.parentNode,ap=[a],bp=[b];if(a===b){hasDuplicate=true;return 0}else if(a.sourceIndex&&b.sourceIndex){return(~b.sourceIndex||MAX_NEGATIVE)-(contains(preferredDoc,a)&&~a.sourceIndex||MAX_NEGATIVE)}else if(!aup||!bup){return a===doc?-1:b===doc?1:aup?-1:bup?1:0}else if(aup===bup){return siblingCheck(a,b)}cur=a;while(cur=cur.parentNode){ap.unshift(cur)}cur=b;while(cur=cur.parentNode){bp.unshift(cur)}while(ap[i]===bp[i]){i++}return i?siblingCheck(ap[i],bp[i]):ap[i]===preferredDoc?-1:bp[i]===preferredDoc?1:0};hasDuplicate=false;[0,0].sort(sortOrder);support.detectDuplicates=hasDuplicate;return document};Sizzle.matches=function(expr,elements){return Sizzle(expr,window.document,null,elements)};Sizzle.matchesSelector=function(elem,expr){if(elem&&(elem.ownerDocument||elem)!==document){setDocument(elem)}expr=expr.replace(rattributeQuotes,"='$1']");if(support.matchesSelector&&!documentIsXML&&(!rbuggyMatches||!rbuggyMatches.test(expr))&&!rbuggyQSA.test(expr)){try{var ret=matches.call(elem,expr);if(ret||support.disconnectedMatch||elem.document&&elem.document.nodeType!==11){return ret
}}catch(e){}}return Sizzle(expr,document,null,[elem]).length>0};Sizzle.contains=function(context,elem){if(context&&(context.ownerDocument||context)!==document){setDocument(context)}return contains(context,elem)};Sizzle.attr=function(elem,name){var val;if(elem&&(elem.ownerDocument||elem)!==document){setDocument(elem)}if(!documentIsXML){name=name.toLowerCase()}if(val=Expr.attrHandle[name]){return val(elem)}if(documentIsXML||support.attributes){return elem.getAttribute(name)}return((val=elem.getAttributeNode(name))||elem.getAttribute(name))&&elem[name]===true?name:val&&val.specified?val.value:null};Sizzle.error=function(msg){throw new Error("Syntax error, unrecognized expression: "+msg)};Sizzle.uniqueSort=function(results){var elem,duplicates=[],i=1,j=0;hasDuplicate=!support.detectDuplicates;results.sort(sortOrder);if(hasDuplicate){for(;elem=results[i];i++){if(elem===results[i-1]){j=duplicates.push(i)}}while(j--){results.splice(duplicates[j],1)}}return results};function siblingCheck(a,b){var cur=a&&b&&a.nextSibling;for(;cur;cur=cur.nextSibling){if(cur===b){return-1}}return a?1:-1}function createInputPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type===type}}function createButtonPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return(name==="input"||name==="button")&&elem.type===type}}function createPositionalPseudo(fn){return markFunction(function(argument){argument=+argument;return markFunction(function(seed,matches){var j,matchIndexes=fn([],seed.length,argument),i=matchIndexes.length;while(i--){if(seed[j=matchIndexes[i]]){seed[j]=!(matches[j]=seed[j])}}})})}getText=Sizzle.getText=function(elem){var node,ret="",i=0,nodeType=elem.nodeType;if(!nodeType){for(;node=elem[i];i++){ret+=getText(node)}}else if(nodeType===1||nodeType===9||nodeType===11){if(typeof elem.textContent==="string"){return elem.textContent}else{for(elem=elem.firstChild;elem;elem=elem.nextSibling){ret+=getText(elem)}}}else if(nodeType===3||nodeType===4){return elem.nodeValue}return ret};Expr=Sizzle.selectors={cacheLength:50,createPseudo:markFunction,match:matchExpr,find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(match){match[1]=match[1].replace(rbackslash,"");match[3]=(match[4]||match[5]||"").replace(rbackslash,"");if(match[2]==="~="){match[3]=" "+match[3]+" "}return match.slice(0,4)},CHILD:function(match){match[1]=match[1].toLowerCase();if(match[1].slice(0,3)==="nth"){if(!match[3]){Sizzle.error(match[0])}match[4]=+(match[4]?match[5]+(match[6]||1):2*(match[3]==="even"||match[3]==="odd"));match[5]=+(match[7]+match[8]||match[3]==="odd")}else if(match[3]){Sizzle.error(match[0])}return match},PSEUDO:function(match){var excess,unquoted=!match[5]&&match[2];if(matchExpr["CHILD"].test(match[0])){return null}if(match[4]){match[2]=match[4]}else if(unquoted&&rpseudo.test(unquoted)&&(excess=tokenize(unquoted,true))&&(excess=unquoted.indexOf(")",unquoted.length-excess)-unquoted.length)){match[0]=match[0].slice(0,excess);match[2]=unquoted.slice(0,excess)}return match.slice(0,3)}},filter:{TAG:function(nodeName){if(nodeName==="*"){return function(){return true}}nodeName=nodeName.replace(rbackslash,"").toLowerCase();return function(elem){return elem.nodeName&&elem.nodeName.toLowerCase()===nodeName}},CLASS:function(className){var pattern=classCache[expando][className+" "];return pattern||(pattern=new RegExp("(^|"+whitespace+")"+className+"("+whitespace+"|$)"))&&classCache(className,function(elem){return pattern.test(elem.className||typeof elem.getAttribute!==strundefined&&elem.getAttribute("class")||"")})},ATTR:function(name,operator,check){return function(elem){var result=Sizzle.attr(elem,name);if(result==null){return operator==="!="}if(!operator){return true}result+="";return operator==="="?result===check:operator==="!="?result!==check:operator==="^="?check&&result.indexOf(check)===0:operator==="*="?check&&result.indexOf(check)>-1:operator==="$="?check&&result.substr(result.length-check.length)===check:operator==="~="?(" "+result+" ").indexOf(check)>-1:operator==="|="?result===check||result.substr(0,check.length+1)===check+"-":false}},CHILD:function(type,what,argument,first,last){var simple=type.slice(0,3)!=="nth",forward=type.slice(-4)!=="last",ofType=what==="of-type";return first===1&&last===0?function(elem){return!!elem.parentNode}:function(elem,context,xml){var cache,outerCache,node,diff,nodeIndex,start,dir=simple!==forward?"nextSibling":"previousSibling",parent=elem.parentNode,name=ofType&&elem.nodeName.toLowerCase(),useCache=!xml&&!ofType;if(parent){if(simple){while(dir){node=elem;while(node=node[dir]){if(ofType?node.nodeName.toLowerCase()===name:node.nodeType===1){return false}}start=dir=type==="only"&&!start&&"nextSibling"}return true}start=[forward?parent.firstChild:parent.lastChild];if(forward&&useCache){outerCache=parent[expando]||(parent[expando]={});cache=outerCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=cache[0]===dirruns&&cache[2];node=nodeIndex&&parent.childNodes[nodeIndex];while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop()){if(node.nodeType===1&&++diff&&node===elem){outerCache[type]=[dirruns,nodeIndex,diff];break}}}else if(useCache&&(cache=(elem[expando]||(elem[expando]={}))[type])&&cache[0]===dirruns){diff=cache[1]}else{while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop()){if((ofType?node.nodeName.toLowerCase()===name:node.nodeType===1)&&++diff){if(useCache){(node[expando]||(node[expando]={}))[type]=[dirruns,diff]}if(node===elem){break}}}}diff-=last;return diff===first||diff%first===0&&diff/first>=0}}},PSEUDO:function(pseudo,argument){var args,fn=Expr.pseudos[pseudo]||Expr.setFilters[pseudo.toLowerCase()]||Sizzle.error("unsupported pseudo: "+pseudo);if(fn[expando]){return fn(argument)}if(fn.length>1){args=[pseudo,pseudo,"",argument];return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())?markFunction(function(seed,matches){var idx,matched=fn(seed,argument),i=matched.length;while(i--){idx=indexOf.call(seed,matched[i]);seed[idx]=!(matches[idx]=matched[i])}}):function(elem){return fn(elem,0,args)}}return fn}},pseudos:{not:markFunction(function(selector){var input=[],results=[],matcher=compile(selector.replace(rtrim,"$1"));return matcher[expando]?markFunction(function(seed,matches,context,xml){var elem,unmatched=matcher(seed,null,xml,[]),i=seed.length;while(i--){if(elem=unmatched[i]){seed[i]=!(matches[i]=elem)}}}):function(elem,context,xml){input[0]=elem;matcher(input,null,xml,results);return!results.pop()}}),has:markFunction(function(selector){return function(elem){return Sizzle(selector,elem).length>0}}),contains:markFunction(function(text){return function(elem){return(elem.textContent||elem.innerText||getText(elem)).indexOf(text)>-1}}),target:function(elem){var hash=window.location&&window.location.hash;return hash&&hash.slice(1)===elem.id},root:function(elem){return elem===docElem},focus:function(elem){return elem===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(elem.type||elem.href||~elem.tabIndex)},enabled:function(elem){return elem.disabled===false},disabled:function(elem){return elem.disabled===true},checked:function(elem){var nodeName=elem.nodeName.toLowerCase();return nodeName==="input"&&!!elem.checked||nodeName==="option"&&!!elem.selected},selected:function(elem){if(elem.parentNode){elem.parentNode.selectedIndex}return elem.selected===true},empty:function(elem){for(elem=elem.firstChild;elem;elem=elem.nextSibling){if(elem.nodeName>"@"||elem.nodeType===3||elem.nodeType===4){return false}}return true},parent:function(elem){return!Expr.pseudos["empty"](elem)},header:function(elem){return rheader.test(elem.nodeName)},input:function(elem){return rinputs.test(elem.nodeName)},button:function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type==="button"||name==="button"},text:function(elem){var attr;return elem.nodeName.toLowerCase()==="input"&&elem.type==="text"&&((attr=elem.getAttribute("type"))==null||attr.toLowerCase()===elem.type)},first:createPositionalPseudo(function(){return[0]}),last:createPositionalPseudo(function(matchIndexes,length){return[length-1]}),eq:createPositionalPseudo(function(matchIndexes,length,argument){return[argument<0?argument+length:argument]}),even:createPositionalPseudo(function(matchIndexes,length){var i=0;for(;i<length;i+=2){matchIndexes.push(i)}return matchIndexes}),odd:createPositionalPseudo(function(matchIndexes,length){var i=1;for(;i<length;i+=2){matchIndexes.push(i)}return matchIndexes}),lt:createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;--i>=0;){matchIndexes.push(i)}return matchIndexes}),gt:createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;++i<length;){matchIndexes.push(i)}return matchIndexes})}};for(i in{radio:true,checkbox:true,file:true,password:true,image:true}){Expr.pseudos[i]=createInputPseudo(i)}for(i in{submit:true,reset:true}){Expr.pseudos[i]=createButtonPseudo(i)}function tokenize(selector,parseOnly){var matched,match,tokens,type,soFar,groups,preFilters,cached=tokenCache[expando][selector+" "];if(cached){return parseOnly?0:cached.slice(0)}soFar=selector;groups=[];preFilters=Expr.preFilter;while(soFar){if(!matched||(match=rcomma.exec(soFar))){if(match){soFar=soFar.slice(match[0].length)||soFar}groups.push(tokens=[])}matched=false;if(match=rcombinators.exec(soFar)){tokens.push(matched=new Token(match.shift()));soFar=soFar.slice(matched.length);matched.type=match[0].replace(rtrim," ")}for(type in Expr.filter){if((match=matchExpr[type].exec(soFar))&&(!preFilters[type]||(match=preFilters[type](match)))){tokens.push(matched=new Token(match.shift()));soFar=soFar.slice(matched.length);matched.type=type;matched.matches=match}}if(!matched){break}}return parseOnly?soFar.length:soFar?Sizzle.error(selector):tokenCache(selector,groups).slice(0)}function addCombinator(matcher,combinator,base){var dir=combinator.dir,checkNonElements=base&&combinator.dir==="parentNode",doneName=done++;return combinator.first?function(elem,context,xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){return matcher(elem,context,xml)}}}:function(elem,context,xml){var data,cache,outerCache,dirkey=dirruns+" "+doneName;if(xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){if(matcher(elem,context,xml)){return true}}}}else{while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){outerCache=elem[expando]||(elem[expando]={});if((cache=outerCache[dir])&&cache[0]===dirkey){if((data=cache[1])===true||data===cachedruns){return data===true}}else{cache=outerCache[dir]=[dirkey];cache[1]=matcher(elem,context,xml)||cachedruns;if(cache[1]===true){return true}}}}}}}function elementMatcher(matchers){return matchers.length>1?function(elem,context,xml){var i=matchers.length;while(i--){if(!matchers[i](elem,context,xml)){return false}}return true}:matchers[0]}function condense(unmatched,map,filter,context,xml){var elem,newUnmatched=[],i=0,len=unmatched.length,mapped=map!=null;for(;i<len;i++){if(elem=unmatched[i]){if(!filter||filter(elem,context,xml)){newUnmatched.push(elem);if(mapped){map.push(i)}}}}return newUnmatched}function setMatcher(preFilter,selector,matcher,postFilter,postFinder,postSelector){if(postFilter&&!postFilter[expando]){postFilter=setMatcher(postFilter)}if(postFinder&&!postFinder[expando]){postFinder=setMatcher(postFinder,postSelector)}return markFunction(function(seed,results,context,xml){var temp,i,elem,preMap=[],postMap=[],preexisting=results.length,elems=seed||multipleContexts(selector||"*",context.nodeType?[context]:context,[]),matcherIn=preFilter&&(seed||!selector)?condense(elems,preMap,preFilter,context,xml):elems,matcherOut=matcher?postFinder||(seed?preFilter:preexisting||postFilter)?[]:results:matcherIn;if(matcher){matcher(matcherIn,matcherOut,context,xml)}if(postFilter){temp=condense(matcherOut,postMap);postFilter(temp,[],context,xml);i=temp.length;while(i--){if(elem=temp[i]){matcherOut[postMap[i]]=!(matcherIn[postMap[i]]=elem)}}}if(seed){if(postFinder||preFilter){if(postFinder){temp=[];i=matcherOut.length;while(i--){if(elem=matcherOut[i]){temp.push(matcherIn[i]=elem)}}postFinder(null,matcherOut=[],temp,xml)}i=matcherOut.length;while(i--){if((elem=matcherOut[i])&&(temp=postFinder?indexOf.call(seed,elem):preMap[i])>-1){seed[temp]=!(results[temp]=elem)}}}}else{matcherOut=condense(matcherOut===results?matcherOut.splice(preexisting,matcherOut.length):matcherOut);if(postFinder){postFinder(null,results,matcherOut,xml)}else{push.apply(results,matcherOut)}}})}function matcherFromTokens(tokens){var checkContext,matcher,j,len=tokens.length,leadingRelative=Expr.relative[tokens[0].type],implicitRelative=leadingRelative||Expr.relative[" "],i=leadingRelative?1:0,matchContext=addCombinator(function(elem){return elem===checkContext},implicitRelative,true),matchAnyContext=addCombinator(function(elem){return indexOf.call(checkContext,elem)>-1},implicitRelative,true),matchers=[function(elem,context,xml){return!leadingRelative&&(xml||context!==outermostContext)||((checkContext=context).nodeType?matchContext(elem,context,xml):matchAnyContext(elem,context,xml))}];for(;i<len;i++){if(matcher=Expr.relative[tokens[i].type]){matchers=[addCombinator(elementMatcher(matchers),matcher)]}else{matcher=Expr.filter[tokens[i].type].apply(null,tokens[i].matches);if(matcher[expando]){j=++i;for(;j<len;j++){if(Expr.relative[tokens[j].type]){break}}return setMatcher(i>1&&elementMatcher(matchers),i>1&&tokens.slice(0,i-1).join("").replace(rtrim,"$1"),matcher,i<j&&matcherFromTokens(tokens.slice(i,j)),j<len&&matcherFromTokens(tokens=tokens.slice(j)),j<len&&tokens.join(""))}matchers.push(matcher)}}return elementMatcher(matchers)}function matcherFromGroupMatchers(elementMatchers,setMatchers){var matcherCachedRuns=0,bySet=setMatchers.length>0,byElement=elementMatchers.length>0,superMatcher=function(seed,context,xml,results,expandContext){var elem,j,matcher,setMatched=[],matchedCount=0,i="0",unmatched=seed&&[],outermost=expandContext!=null,contextBackup=outermostContext,elems=seed||byElement&&Expr.find["TAG"]("*",expandContext&&context.parentNode||context),dirrunsUnique=dirruns+=contextBackup==null?1:Math.E;if(outermost){outermostContext=context!==document&&context;cachedruns=matcherCachedRuns}for(;(elem=elems[i])!=null;i++){if(byElement&&elem){for(j=0;matcher=elementMatchers[j];j++){if(matcher(elem,context,xml)){results.push(elem);break}}if(outermost){dirruns=dirrunsUnique;cachedruns=++matcherCachedRuns}}if(bySet){if(elem=!matcher&&elem){matchedCount--}if(seed){unmatched.push(elem)}}}matchedCount+=i;if(bySet&&i!==matchedCount){for(j=0;matcher=setMatchers[j];j++){matcher(unmatched,setMatched,context,xml)}if(seed){if(matchedCount>0){while(i--){if(!(unmatched[i]||setMatched[i])){setMatched[i]=pop.call(results)}}}setMatched=condense(setMatched)}push.apply(results,setMatched);if(outermost&&!seed&&setMatched.length>0&&matchedCount+setMatchers.length>1){Sizzle.uniqueSort(results)}}if(outermost){dirruns=dirrunsUnique;outermostContext=contextBackup}return unmatched};return bySet?markFunction(superMatcher):superMatcher}compile=Sizzle.compile=function(selector,group){var i,setMatchers=[],elementMatchers=[],cached=compilerCache[expando][selector+" "];if(!cached){if(!group){group=tokenize(selector)}i=group.length;while(i--){cached=matcherFromTokens(group[i]);if(cached[expando]){setMatchers.push(cached)}else{elementMatchers.push(cached)}}cached=compilerCache(selector,matcherFromGroupMatchers(elementMatchers,setMatchers))}return cached};function multipleContexts(selector,contexts,results){var i=0,len=contexts.length;for(;i<len;i++){Sizzle(selector,contexts[i],results)}return results}function select(selector,context,results,seed){var i,tokens,token,type,find,match=tokenize(selector);if(!seed){if(match.length===1){tokens=match[0]=match[0].slice(0);if(tokens.length>2&&(token=tokens[0]).type==="ID"&&context.nodeType===9&&!documentIsXML&&Expr.relative[tokens[1].type]){context=Expr.find["ID"](token.matches[0].replace(rbackslash,""),context)[0];if(!context){return results}selector=selector.slice(tokens.shift().length)}for(i=matchExpr["needsContext"].test(selector)?-1:tokens.length-1;i>=0;i--){token=tokens[i];if(Expr.relative[type=token.type]){break}if(find=Expr.find[type]){if(seed=find(token.matches[0].replace(rbackslash,""),rsibling.test(tokens[0].type)&&context.parentNode||context)){tokens.splice(i,1);selector=seed.length&&tokens.join("");if(!selector){push.apply(results,slice.call(seed,0));return results}break}}}}}compile(selector,match)(seed,context,documentIsXML,results,rsibling.test(selector));return results}Expr.pseudos["nth"]=Expr.pseudos["eq"];function setFilters(){}Expr.filters=setFilters.prototype=Expr.pseudos;Expr.setFilters=new setFilters;setDocument();Sizzle.attr=jQuery.attr;jQuery.find=Sizzle;jQuery.expr=Sizzle.selectors;jQuery.expr[":"]=jQuery.expr.pseudos;jQuery.unique=Sizzle.uniqueSort;jQuery.text=Sizzle.getText;jQuery.isXMLDoc=Sizzle.isXML;jQuery.contains=Sizzle.contains})(window);var runtil=/Until$/,rparentsprev=/^(?:parents|prev(?:Until|All))/,isSimple=/^.[^:#\[\.,]*$/,rneedsContext=jQuery.expr.match.needsContext,guaranteedUnique={children:true,contents:true,next:true,prev:true};jQuery.fn.extend({find:function(selector){var i,l,length,n,r,ret,self=this;if(typeof selector!=="string"){return jQuery(selector).filter(function(){for(i=0,l=self.length;i<l;i++){if(jQuery.contains(self[i],this)){return true}}})}ret=this.pushStack("","find",selector);for(i=0,l=this.length;i<l;i++){length=ret.length;jQuery.find(selector,this[i],ret);if(i>0){for(n=length;n<ret.length;n++){for(r=0;r<length;r++){if(ret[r]===ret[n]){ret.splice(n--,1);break}}}}}return ret},has:function(target){var i,targets=jQuery(target,this),len=targets.length;return this.filter(function(){for(i=0;i<len;i++){if(jQuery.contains(this,targets[i])){return true}}})},not:function(selector){return this.pushStack(winnow(this,selector,false),"not",selector)},filter:function(selector){return this.pushStack(winnow(this,selector,true),"filter",selector)},is:function(selector){return!!selector&&(typeof selector==="string"?rneedsContext.test(selector)?jQuery(selector,this.context).index(this[0])>=0:jQuery.filter(selector,this).length>0:this.filter(selector).length>0)},closest:function(selectors,context){var cur,i=0,l=this.length,ret=[],pos=rneedsContext.test(selectors)||typeof selectors!=="string"?jQuery(selectors,context||this.context):0;for(;i<l;i++){cur=this[i];while(cur&&cur.ownerDocument&&cur!==context&&cur.nodeType!==11){if(pos?pos.index(cur)>-1:jQuery.find.matchesSelector(cur,selectors)){ret.push(cur);break}cur=cur.parentNode}}ret=ret.length>1?jQuery.unique(ret):ret;return this.pushStack(ret,"closest",selectors)},index:function(elem){if(!elem){return this[0]&&this[0].parentNode?this.prevAll().length:-1}if(typeof elem==="string"){return jQuery.inArray(this[0],jQuery(elem))}return jQuery.inArray(elem.jquery?elem[0]:elem,this)},add:function(selector,context){var set=typeof selector==="string"?jQuery(selector,context):jQuery.makeArray(selector&&selector.nodeType?[selector]:selector),all=jQuery.merge(this.get(),set);return this.pushStack(isDisconnected(set[0])||isDisconnected(all[0])?all:jQuery.unique(all))},addBack:function(selector){return this.add(selector==null?this.prevObject:this.prevObject.filter(selector))}});jQuery.fn.andSelf=jQuery.fn.addBack;function isDisconnected(node){return!node||!node.parentNode||node.parentNode.nodeType===11}function sibling(cur,dir){do{cur=cur[dir]}while(cur&&cur.nodeType!==1);return cur}jQuery.each({parent:function(elem){var parent=elem.parentNode;return parent&&parent.nodeType!==11?parent:null},parents:function(elem){return jQuery.dir(elem,"parentNode")},parentsUntil:function(elem,i,until){return jQuery.dir(elem,"parentNode",until)},next:function(elem){return sibling(elem,"nextSibling")},prev:function(elem){return sibling(elem,"previousSibling")},nextAll:function(elem){return jQuery.dir(elem,"nextSibling")},prevAll:function(elem){return jQuery.dir(elem,"previousSibling")},nextUntil:function(elem,i,until){return jQuery.dir(elem,"nextSibling",until)},prevUntil:function(elem,i,until){return jQuery.dir(elem,"previousSibling",until)},siblings:function(elem){return jQuery.sibling((elem.parentNode||{}).firstChild,elem)},children:function(elem){return jQuery.sibling(elem.firstChild)},contents:function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.merge([],elem.childNodes)}},function(name,fn){jQuery.fn[name]=function(until,selector){var ret=jQuery.map(this,fn,until);if(!runtil.test(name)){selector=until}if(selector&&typeof selector==="string"){ret=jQuery.filter(selector,ret)}ret=this.length>1&&!guaranteedUnique[name]?jQuery.unique(ret):ret;if(this.length>1&&rparentsprev.test(name)){ret=ret.reverse()}return this.pushStack(ret,name,core_slice.call(arguments).join(","))}});jQuery.extend({filter:function(expr,elems,not){if(not){expr=":not("+expr+")"}return elems.length===1?jQuery.find.matchesSelector(elems[0],expr)?[elems[0]]:[]:jQuery.find.matches(expr,elems)},dir:function(elem,dir,until){var matched=[],cur=elem[dir];while(cur&&cur.nodeType!==9&&(until===undefined||cur.nodeType!==1||!jQuery(cur).is(until))){if(cur.nodeType===1){matched.push(cur)}cur=cur[dir]}return matched},sibling:function(n,elem){var r=[];for(;n;n=n.nextSibling){if(n.nodeType===1&&n!==elem){r.push(n)}}return r}});function winnow(elements,qualifier,keep){qualifier=qualifier||0;if(jQuery.isFunction(qualifier)){return jQuery.grep(elements,function(elem,i){var retVal=!!qualifier.call(elem,i,elem);return retVal===keep})}else if(qualifier.nodeType){return jQuery.grep(elements,function(elem,i){return elem===qualifier===keep})}else if(typeof qualifier==="string"){var filtered=jQuery.grep(elements,function(elem){return elem.nodeType===1});if(isSimple.test(qualifier)){return jQuery.filter(qualifier,filtered,!keep)}else{qualifier=jQuery.filter(qualifier,filtered)}}return jQuery.grep(elements,function(elem,i){return jQuery.inArray(elem,qualifier)>=0===keep})}function createSafeFragment(document){var list=nodeNames.split("|"),safeFrag=document.createDocumentFragment();if(safeFrag.createElement){while(list.length){safeFrag.createElement(list.pop())}}return safeFrag}var nodeNames="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|"+"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",rinlinejQuery=/ jQuery\d+="(?:null|\d+)"/g,rleadingWhitespace=/^\s+/,rxhtmlTag=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,rtagName=/<([\w:]+)/,rtbody=/<tbody/i,rhtml=/<|&#?\w+;/,rnoInnerhtml=/<(?:script|style|link)/i,rnocache=/<(?:script|object|embed|option|style)/i,rnoshimcache=new RegExp("<(?:"+nodeNames+")[\\s/>]","i"),rcheckableType=/^(?:checkbox|radio)$/,rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rscriptType=/\/(java|ecma)script/i,rcleanScript=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,wrapMap={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},safeFragment=createSafeFragment(document),fragmentDiv=safeFragment.appendChild(document.createElement("div"));wrapMap.optgroup=wrapMap.option;wrapMap.tbody=wrapMap.tfoot=wrapMap.colgroup=wrapMap.caption=wrapMap.thead;wrapMap.th=wrapMap.td;if(!jQuery.support.htmlSerialize){wrapMap._default=[1,"X<div>","</div>"]}jQuery.fn.extend({text:function(value){return jQuery.access(this,function(value){return value===undefined?jQuery.text(this):this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(value))},null,value,arguments.length)},wrapAll:function(html){if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapAll(html.call(this,i))})}if(this[0]){var wrap=jQuery(html,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode){wrap.insertBefore(this[0])}wrap.map(function(){var elem=this;while(elem.firstChild&&elem.firstChild.nodeType===1){elem=elem.firstChild}return elem}).append(this)}return this},wrapInner:function(html){if(jQuery.isFunction(html)){return this.each(function(i){jQuery(this).wrapInner(html.call(this,i))})}return this.each(function(){var self=jQuery(this),contents=self.contents();if(contents.length){contents.wrapAll(html)}else{self.append(html)}})},wrap:function(html){var isFunction=jQuery.isFunction(html);return this.each(function(i){jQuery(this).wrapAll(isFunction?html.call(this,i):html)})},unwrap:function(){return this.parent().each(function(){if(!jQuery.nodeName(this,"body")){jQuery(this).replaceWith(this.childNodes)}}).end()},append:function(){return this.domManip(arguments,true,function(elem){if(this.nodeType===1||this.nodeType===11){this.appendChild(elem)}})},prepend:function(){return this.domManip(arguments,true,function(elem){if(this.nodeType===1||this.nodeType===11){this.insertBefore(elem,this.firstChild)}})},before:function(){if(!isDisconnected(this[0])){return this.domManip(arguments,false,function(elem){this.parentNode.insertBefore(elem,this)})}if(arguments.length){var set=jQuery.clean(arguments);return this.pushStack(jQuery.merge(set,this),"before",this.selector)}},after:function(){if(!isDisconnected(this[0])){return this.domManip(arguments,false,function(elem){this.parentNode.insertBefore(elem,this.nextSibling)})}if(arguments.length){var set=jQuery.clean(arguments);return this.pushStack(jQuery.merge(this,set),"after",this.selector)}},remove:function(selector,keepData){var elem,i=0;for(;(elem=this[i])!=null;i++){if(!selector||jQuery.filter(selector,[elem]).length){if(!keepData&&elem.nodeType===1){jQuery.cleanData(elem.getElementsByTagName("*"));jQuery.cleanData([elem])}if(elem.parentNode){elem.parentNode.removeChild(elem)}}}return this},empty:function(){var elem,i=0;for(;(elem=this[i])!=null;i++){if(elem.nodeType===1){jQuery.cleanData(elem.getElementsByTagName("*"))}while(elem.firstChild){elem.removeChild(elem.firstChild)}}return this},clone:function(dataAndEvents,deepDataAndEvents){dataAndEvents=dataAndEvents==null?false:dataAndEvents;deepDataAndEvents=deepDataAndEvents==null?dataAndEvents:deepDataAndEvents;return this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents)})},html:function(value){return jQuery.access(this,function(value){var elem=this[0]||{},i=0,l=this.length;if(value===undefined){return elem.nodeType===1?elem.innerHTML.replace(rinlinejQuery,""):undefined}if(typeof value==="string"&&!rnoInnerhtml.test(value)&&(jQuery.support.htmlSerialize||!rnoshimcache.test(value))&&(jQuery.support.leadingWhitespace||!rleadingWhitespace.test(value))&&!wrapMap[(rtagName.exec(value)||["",""])[1].toLowerCase()]){value=value.replace(rxhtmlTag,"<$1></$2>");try{for(;i<l;i++){elem=this[i]||{};if(elem.nodeType===1){jQuery.cleanData(elem.getElementsByTagName("*"));elem.innerHTML=value}}elem=0}catch(e){}}if(elem){this.empty().append(value)}},null,value,arguments.length)},replaceWith:function(value){if(!isDisconnected(this[0])){if(jQuery.isFunction(value)){return this.each(function(i){var self=jQuery(this),old=self.html();self.replaceWith(value.call(this,i,old))})}if(typeof value!=="string"){value=jQuery(value).detach()}return this.each(function(){var next=this.nextSibling,parent=this.parentNode;jQuery(this).remove();if(next){jQuery(next).before(value)}else{jQuery(parent).append(value)}})}return this.length?this.pushStack(jQuery(jQuery.isFunction(value)?value():value),"replaceWith",value):this},detach:function(selector){return this.remove(selector,true)},domManip:function(args,table,callback){args=[].concat.apply([],args);var results,first,fragment,iNoClone,i=0,value=args[0],scripts=[],l=this.length;if(!jQuery.support.checkClone&&l>1&&typeof value==="string"&&rchecked.test(value)){return this.each(function(){jQuery(this).domManip(args,table,callback)})}if(jQuery.isFunction(value)){return this.each(function(i){var self=jQuery(this);args[0]=value.call(this,i,table?self.html():undefined);self.domManip(args,table,callback)})}if(this[0]){results=jQuery.buildFragment(args,this,scripts);fragment=results.fragment;first=fragment.firstChild;if(fragment.childNodes.length===1){fragment=first}if(first){table=table&&jQuery.nodeName(first,"tr");for(iNoClone=results.cacheable||l-1;i<l;i++){callback.call(table&&jQuery.nodeName(this[i],"table")?findOrAppend(this[i],"tbody"):this[i],i===iNoClone?fragment:jQuery.clone(fragment,true,true))}}fragment=first=null;if(scripts.length){jQuery.each(scripts,function(i,elem){if(elem.src){if(jQuery.ajax){jQuery.ajax({url:elem.src,type:"GET",dataType:"script",async:false,global:false,"throws":true})}else{jQuery.error("no ajax")}}else{jQuery.globalEval((elem.text||elem.textContent||elem.innerHTML||"").replace(rcleanScript,""))}if(elem.parentNode){elem.parentNode.removeChild(elem)}})}}return this}});function findOrAppend(elem,tag){return elem.getElementsByTagName(tag)[0]||elem.appendChild(elem.ownerDocument.createElement(tag))}function cloneCopyEvent(src,dest){if(dest.nodeType!==1||!jQuery.hasData(src)){return}var type,i,l,oldData=jQuery._data(src),curData=jQuery._data(dest,oldData),events=oldData.events;if(events){delete curData.handle;curData.events={};for(type in events){for(i=0,l=events[type].length;i<l;i++){jQuery.event.add(dest,type,events[type][i])}}}if(curData.data){curData.data=jQuery.extend({},curData.data)}}function cloneFixAttributes(src,dest){var nodeName;if(dest.nodeType!==1){return}if(dest.clearAttributes){dest.clearAttributes()}if(dest.mergeAttributes){dest.mergeAttributes(src)}nodeName=dest.nodeName.toLowerCase();if(nodeName==="object"){if(dest.parentNode){dest.outerHTML=src.outerHTML}if(jQuery.support.html5Clone&&src.innerHTML&&!jQuery.trim(dest.innerHTML)){dest.innerHTML=src.innerHTML}}else if(nodeName==="input"&&rcheckableType.test(src.type)){dest.defaultChecked=dest.checked=src.checked;if(dest.value!==src.value){dest.value=src.value}}else if(nodeName==="option"){dest.selected=src.defaultSelected}else if(nodeName==="input"||nodeName==="textarea"){dest.defaultValue=src.defaultValue}else if(nodeName==="script"&&dest.text!==src.text){dest.text=src.text}dest.removeAttribute(jQuery.expando)}jQuery.buildFragment=function(args,context,scripts){var fragment,cacheable,cachehit,first=args[0];context=context||document;context=!context.nodeType&&context[0]||context;context=context.ownerDocument||context;if(args.length===1&&typeof first==="string"&&first.length<512&&context===document&&first.charAt(0)==="<"&&!rnocache.test(first)&&(jQuery.support.checkClone||!rchecked.test(first))&&(jQuery.support.html5Clone||!rnoshimcache.test(first))){cacheable=true;fragment=jQuery.fragments[first];cachehit=fragment!==undefined}if(!fragment){fragment=context.createDocumentFragment();jQuery.clean(args,context,fragment,scripts);if(cacheable){jQuery.fragments[first]=cachehit&&fragment}}return{fragment:fragment,cacheable:cacheable}};jQuery.fragments={};jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){var elems,i=0,ret=[],insert=jQuery(selector),l=insert.length,parent=this.length===1&&this[0].parentNode;if((parent==null||parent&&parent.nodeType===11&&parent.childNodes.length===1)&&l===1){insert[original](this[0]);return this}else{for(;i<l;i++){elems=(i>0?this.clone(true):this).get();jQuery(insert[i])[original](elems);ret=ret.concat(elems)}return this.pushStack(ret,name,insert.selector)}}});function getAll(elem){if(typeof elem.getElementsByTagName!=="undefined"){return elem.getElementsByTagName("*")}else if(typeof elem.querySelectorAll!=="undefined"){return elem.querySelectorAll("*")
}else{return[]}}function fixDefaultChecked(elem){if(rcheckableType.test(elem.type)){elem.defaultChecked=elem.checked}}jQuery.extend({clone:function(elem,dataAndEvents,deepDataAndEvents){var srcElements,destElements,i,clone;if(jQuery.support.html5Clone||jQuery.isXMLDoc(elem)||!rnoshimcache.test("<"+elem.nodeName+">")){clone=elem.cloneNode(true)}else{fragmentDiv.innerHTML=elem.outerHTML;fragmentDiv.removeChild(clone=fragmentDiv.firstChild)}if((!jQuery.support.noCloneEvent||!jQuery.support.noCloneChecked)&&(elem.nodeType===1||elem.nodeType===11)&&!jQuery.isXMLDoc(elem)){cloneFixAttributes(elem,clone);srcElements=getAll(elem);destElements=getAll(clone);for(i=0;srcElements[i];++i){if(destElements[i]){cloneFixAttributes(srcElements[i],destElements[i])}}}if(dataAndEvents){cloneCopyEvent(elem,clone);if(deepDataAndEvents){srcElements=getAll(elem);destElements=getAll(clone);for(i=0;srcElements[i];++i){cloneCopyEvent(srcElements[i],destElements[i])}}}srcElements=destElements=null;return clone},clean:function(elems,context,fragment,scripts){var i,j,elem,tag,wrap,depth,div,hasBody,tbody,len,handleScript,jsTags,safe=context===document&&safeFragment,ret=[];if(!context||typeof context.createDocumentFragment==="undefined"){context=document}for(i=0;(elem=elems[i])!=null;i++){if(typeof elem==="number"){elem+=""}if(!elem){continue}if(typeof elem==="string"){if(!rhtml.test(elem)){elem=context.createTextNode(elem)}else{safe=safe||createSafeFragment(context);div=context.createElement("div");safe.appendChild(div);elem=elem.replace(rxhtmlTag,"<$1></$2>");tag=(rtagName.exec(elem)||["",""])[1].toLowerCase();wrap=wrapMap[tag]||wrapMap._default;depth=wrap[0];div.innerHTML=wrap[1]+elem+wrap[2];while(depth--){div=div.lastChild}if(!jQuery.support.tbody){hasBody=rtbody.test(elem);tbody=tag==="table"&&!hasBody?div.firstChild&&div.firstChild.childNodes:wrap[1]==="<table>"&&!hasBody?div.childNodes:[];for(j=tbody.length-1;j>=0;--j){if(jQuery.nodeName(tbody[j],"tbody")&&!tbody[j].childNodes.length){tbody[j].parentNode.removeChild(tbody[j])}}}if(!jQuery.support.leadingWhitespace&&rleadingWhitespace.test(elem)){div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]),div.firstChild)}elem=div.childNodes;div.parentNode.removeChild(div)}}if(elem.nodeType){ret.push(elem)}else{jQuery.merge(ret,elem)}}if(div){elem=div=safe=null}if(!jQuery.support.appendChecked){for(i=0;(elem=ret[i])!=null;i++){if(jQuery.nodeName(elem,"input")){fixDefaultChecked(elem)}else if(typeof elem.getElementsByTagName!=="undefined"){jQuery.grep(elem.getElementsByTagName("input"),fixDefaultChecked)}}}if(fragment){handleScript=function(elem){if(!elem.type||rscriptType.test(elem.type)){return scripts?scripts.push(elem.parentNode?elem.parentNode.removeChild(elem):elem):fragment.appendChild(elem)}};for(i=0;(elem=ret[i])!=null;i++){if(!(jQuery.nodeName(elem,"script")&&handleScript(elem))){fragment.appendChild(elem);if(typeof elem.getElementsByTagName!=="undefined"){jsTags=jQuery.grep(jQuery.merge([],elem.getElementsByTagName("script")),handleScript);ret.splice.apply(ret,[i+1,0].concat(jsTags));i+=jsTags.length}}}}return ret},cleanData:function(elems,acceptData){var data,id,elem,type,i=0,internalKey=jQuery.expando,cache=jQuery.cache,deleteExpando=jQuery.support.deleteExpando,special=jQuery.event.special;for(;(elem=elems[i])!=null;i++){if(acceptData||jQuery.acceptData(elem)){id=elem[internalKey];data=id&&cache[id];if(data){if(data.events){for(type in data.events){if(special[type]){jQuery.event.remove(elem,type)}else{jQuery.removeEvent(elem,type,data.handle)}}}if(cache[id]){delete cache[id];if(deleteExpando){delete elem[internalKey]}else if(elem.removeAttribute){elem.removeAttribute(internalKey)}else{elem[internalKey]=null}jQuery.deletedIds.push(id)}}}}}});(function(){var matched,browser;jQuery.uaMatch=function(ua){ua=ua.toLowerCase();var match=/(chrome)[ \/]([\w.]+)/.exec(ua)||/(webkit)[ \/]([\w.]+)/.exec(ua)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)||/(msie) ([\w.]+)/.exec(ua)||ua.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)||[];return{browser:match[1]||"",version:match[2]||"0"}};matched=jQuery.uaMatch(navigator.userAgent);browser={};if(matched.browser){browser[matched.browser]=true;browser.version=matched.version}if(browser.chrome){browser.webkit=true}else if(browser.webkit){browser.safari=true}jQuery.browser=browser;jQuery.sub=function(){function jQuerySub(selector,context){return new jQuerySub.fn.init(selector,context)}jQuery.extend(true,jQuerySub,this);jQuerySub.superclass=this;jQuerySub.fn=jQuerySub.prototype=this();jQuerySub.fn.constructor=jQuerySub;jQuerySub.sub=this.sub;jQuerySub.fn.init=function init(selector,context){if(context&&context instanceof jQuery&&!(context instanceof jQuerySub)){context=jQuerySub(context)}return jQuery.fn.init.call(this,selector,context,rootjQuerySub)};jQuerySub.fn.init.prototype=jQuerySub.fn;var rootjQuerySub=jQuerySub(document);return jQuerySub}})();var curCSS,iframe,iframeDoc,ralpha=/alpha\([^)]*\)/i,ropacity=/opacity=([^)]*)/,rposition=/^(top|right|bottom|left)$/,rdisplayswap=/^(none|table(?!-c[ea]).+)/,rmargin=/^margin/,rnumsplit=new RegExp("^("+core_pnum+")(.*)$","i"),rnumnonpx=new RegExp("^("+core_pnum+")(?!px)[a-z%]+$","i"),rrelNum=new RegExp("^([-+])=("+core_pnum+")","i"),elemdisplay={BODY:"block"},cssShow={position:"absolute",visibility:"hidden",display:"block"},cssNormalTransform={letterSpacing:0,fontWeight:400},cssExpand=["Top","Right","Bottom","Left"],cssPrefixes=["Webkit","O","Moz","ms"],eventsToggle=jQuery.fn.toggle;function vendorPropName(style,name){if(name in style){return name}var capName=name.charAt(0).toUpperCase()+name.slice(1),origName=name,i=cssPrefixes.length;while(i--){name=cssPrefixes[i]+capName;if(name in style){return name}}return origName}function isHidden(elem,el){elem=el||elem;return jQuery.css(elem,"display")==="none"||!jQuery.contains(elem.ownerDocument,elem)}function showHide(elements,show){var elem,display,values=[],index=0,length=elements.length;for(;index<length;index++){elem=elements[index];if(!elem.style){continue}values[index]=jQuery._data(elem,"olddisplay");if(show){if(!values[index]&&elem.style.display==="none"){elem.style.display=""}if(elem.style.display===""&&isHidden(elem)){values[index]=jQuery._data(elem,"olddisplay",css_defaultDisplay(elem.nodeName))}}else{display=curCSS(elem,"display");if(!values[index]&&display!=="none"){jQuery._data(elem,"olddisplay",display)}}}for(index=0;index<length;index++){elem=elements[index];if(!elem.style){continue}if(!show||elem.style.display==="none"||elem.style.display===""){elem.style.display=show?values[index]||"":"none"}}return elements}jQuery.fn.extend({css:function(name,value){return jQuery.access(this,function(elem,name,value){return value!==undefined?jQuery.style(elem,name,value):jQuery.css(elem,name)},name,value,arguments.length>1)},show:function(){return showHide(this,true)},hide:function(){return showHide(this)},toggle:function(state,fn2){var bool=typeof state==="boolean";if(jQuery.isFunction(state)&&jQuery.isFunction(fn2)){return eventsToggle.apply(this,arguments)}return this.each(function(){if(bool?state:isHidden(this)){jQuery(this).show()}else{jQuery(this).hide()}})}});jQuery.extend({cssHooks:{opacity:{get:function(elem,computed){if(computed){var ret=curCSS(elem,"opacity");return ret===""?"1":ret}}}},cssNumber:{fillOpacity:true,fontWeight:true,lineHeight:true,opacity:true,orphans:true,widows:true,zIndex:true,zoom:true},cssProps:{"float":jQuery.support.cssFloat?"cssFloat":"styleFloat"},style:function(elem,name,value,extra){if(!elem||elem.nodeType===3||elem.nodeType===8||!elem.style){return}var ret,type,hooks,origName=jQuery.camelCase(name),style=elem.style;name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(style,origName));hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName];if(value!==undefined){type=typeof value;if(type==="string"&&(ret=rrelNum.exec(value))){value=(ret[1]+1)*ret[2]+parseFloat(jQuery.css(elem,name));type="number"}if(value==null||type==="number"&&isNaN(value)){return}if(type==="number"&&!jQuery.cssNumber[origName]){value+="px"}if(!hooks||!("set"in hooks)||(value=hooks.set(elem,value,extra))!==undefined){try{style[name]=value}catch(e){}}}else{if(hooks&&"get"in hooks&&(ret=hooks.get(elem,false,extra))!==undefined){return ret}return style[name]}},css:function(elem,name,numeric,extra){var val,num,hooks,origName=jQuery.camelCase(name);name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(elem.style,origName));hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName];if(hooks&&"get"in hooks){val=hooks.get(elem,true,extra)}if(val===undefined){val=curCSS(elem,name)}if(val==="normal"&&name in cssNormalTransform){val=cssNormalTransform[name]}if(numeric||extra!==undefined){num=parseFloat(val);return numeric||jQuery.isNumeric(num)?num||0:val}return val},swap:function(elem,options,callback){var ret,name,old={};for(name in options){old[name]=elem.style[name];elem.style[name]=options[name]}ret=callback.call(elem);for(name in options){elem.style[name]=old[name]}return ret}});if(window.getComputedStyle){curCSS=function(elem,name){var ret,width,minWidth,maxWidth,computed=window.getComputedStyle(elem,null),style=elem.style;if(computed){ret=computed.getPropertyValue(name)||computed[name];if(ret===""&&!jQuery.contains(elem.ownerDocument,elem)){ret=jQuery.style(elem,name)}if(rnumnonpx.test(ret)&&rmargin.test(name)){width=style.width;minWidth=style.minWidth;maxWidth=style.maxWidth;style.minWidth=style.maxWidth=style.width=ret;ret=computed.width;style.width=width;style.minWidth=minWidth;style.maxWidth=maxWidth}}return ret}}else if(document.documentElement.currentStyle){curCSS=function(elem,name){var left,rsLeft,ret=elem.currentStyle&&elem.currentStyle[name],style=elem.style;if(ret==null&&style&&style[name]){ret=style[name]}if(rnumnonpx.test(ret)&&!rposition.test(name)){left=style.left;rsLeft=elem.runtimeStyle&&elem.runtimeStyle.left;if(rsLeft){elem.runtimeStyle.left=elem.currentStyle.left}style.left=name==="fontSize"?"1em":ret;ret=style.pixelLeft+"px";style.left=left;if(rsLeft){elem.runtimeStyle.left=rsLeft}}return ret===""?"auto":ret}}function setPositiveNumber(elem,value,subtract){var matches=rnumsplit.exec(value);return matches?Math.max(0,matches[1]-(subtract||0))+(matches[2]||"px"):value}function augmentWidthOrHeight(elem,name,extra,isBorderBox){var i=extra===(isBorderBox?"border":"content")?4:name==="width"?1:0,val=0;for(;i<4;i+=2){if(extra==="margin"){val+=jQuery.css(elem,extra+cssExpand[i],true)}if(isBorderBox){if(extra==="content"){val-=parseFloat(curCSS(elem,"padding"+cssExpand[i]))||0}if(extra!=="margin"){val-=parseFloat(curCSS(elem,"border"+cssExpand[i]+"Width"))||0}}else{val+=parseFloat(curCSS(elem,"padding"+cssExpand[i]))||0;if(extra!=="padding"){val+=parseFloat(curCSS(elem,"border"+cssExpand[i]+"Width"))||0}}}return val}function getWidthOrHeight(elem,name,extra){var val=name==="width"?elem.offsetWidth:elem.offsetHeight,valueIsBorderBox=true,isBorderBox=jQuery.support.boxSizing&&jQuery.css(elem,"boxSizing")==="border-box";if(val<=0||val==null){val=curCSS(elem,name);if(val<0||val==null){val=elem.style[name]}if(rnumnonpx.test(val)){return val}valueIsBorderBox=isBorderBox&&(jQuery.support.boxSizingReliable||val===elem.style[name]);val=parseFloat(val)||0}return val+augmentWidthOrHeight(elem,name,extra||(isBorderBox?"border":"content"),valueIsBorderBox)+"px"}function css_defaultDisplay(nodeName){if(elemdisplay[nodeName]){return elemdisplay[nodeName]}var elem=jQuery("<"+nodeName+">").appendTo(document.body),display=elem.css("display");elem.remove();if(display==="none"||display===""){iframe=document.body.appendChild(iframe||jQuery.extend(document.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!iframeDoc||!iframe.createElement){iframeDoc=(iframe.contentWindow||iframe.contentDocument).document;iframeDoc.write("<!doctype html><html><body>");iframeDoc.close()}elem=iframeDoc.body.appendChild(iframeDoc.createElement(nodeName));display=curCSS(elem,"display");document.body.removeChild(iframe)}elemdisplay[nodeName]=display;return display}jQuery.each(["height","width"],function(i,name){jQuery.cssHooks[name]={get:function(elem,computed,extra){if(computed){if(elem.offsetWidth===0&&rdisplayswap.test(curCSS(elem,"display"))){return jQuery.swap(elem,cssShow,function(){return getWidthOrHeight(elem,name,extra)})}else{return getWidthOrHeight(elem,name,extra)}}},set:function(elem,value,extra){return setPositiveNumber(elem,value,extra?augmentWidthOrHeight(elem,name,extra,jQuery.support.boxSizing&&jQuery.css(elem,"boxSizing")==="border-box"):0)}}});if(!jQuery.support.opacity){jQuery.cssHooks.opacity={get:function(elem,computed){return ropacity.test((computed&&elem.currentStyle?elem.currentStyle.filter:elem.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":computed?"1":""},set:function(elem,value){var style=elem.style,currentStyle=elem.currentStyle,opacity=jQuery.isNumeric(value)?"alpha(opacity="+value*100+")":"",filter=currentStyle&&currentStyle.filter||style.filter||"";style.zoom=1;if(value>=1&&jQuery.trim(filter.replace(ralpha,""))===""&&style.removeAttribute){style.removeAttribute("filter");if(currentStyle&&!currentStyle.filter){return}}style.filter=ralpha.test(filter)?filter.replace(ralpha,opacity):filter+" "+opacity}}}jQuery(function(){if(!jQuery.support.reliableMarginRight){jQuery.cssHooks.marginRight={get:function(elem,computed){return jQuery.swap(elem,{display:"inline-block"},function(){if(computed){return curCSS(elem,"marginRight")}})}}}if(!jQuery.support.pixelPosition&&jQuery.fn.position){jQuery.each(["top","left"],function(i,prop){jQuery.cssHooks[prop]={get:function(elem,computed){if(computed){var ret=curCSS(elem,prop);return rnumnonpx.test(ret)?jQuery(elem).position()[prop]+"px":ret}}}})}});if(jQuery.expr&&jQuery.expr.filters){jQuery.expr.filters.hidden=function(elem){return elem.offsetWidth===0&&elem.offsetHeight===0||!jQuery.support.reliableHiddenOffsets&&(elem.style&&elem.style.display||curCSS(elem,"display"))==="none"};jQuery.expr.filters.visible=function(elem){return!jQuery.expr.filters.hidden(elem)}}jQuery.each({margin:"",padding:"",border:"Width"},function(prefix,suffix){jQuery.cssHooks[prefix+suffix]={expand:function(value){var i,parts=typeof value==="string"?value.split(" "):[value],expanded={};for(i=0;i<4;i++){expanded[prefix+cssExpand[i]+suffix]=parts[i]||parts[i-2]||parts[0]}return expanded}};if(!rmargin.test(prefix)){jQuery.cssHooks[prefix+suffix].set=setPositiveNumber}});var r20=/%20/g,rbracket=/\[\]$/,rCRLF=/\r?\n/g,rinput=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,rselectTextarea=/^(?:select|textarea)/i;jQuery.fn.extend({serialize:function(){return jQuery.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?jQuery.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||rselectTextarea.test(this.nodeName)||rinput.test(this.type))}).map(function(i,elem){var val=jQuery(this).val();return val==null?null:jQuery.isArray(val)?jQuery.map(val,function(val,i){return{name:elem.name,value:val.replace(rCRLF,"\r\n")}}):{name:elem.name,value:val.replace(rCRLF,"\r\n")}}).get()}});jQuery.param=function(a,traditional){var prefix,s=[],add=function(key,value){value=jQuery.isFunction(value)?value():value==null?"":value;s[s.length]=encodeURIComponent(key)+"="+encodeURIComponent(value)};if(traditional===undefined){traditional=jQuery.ajaxSettings&&jQuery.ajaxSettings.traditional}if(jQuery.isArray(a)||a.jquery&&!jQuery.isPlainObject(a)){jQuery.each(a,function(){add(this.name,this.value)})}else{for(prefix in a){buildParams(prefix,a[prefix],traditional,add)}}return s.join("&").replace(r20,"+")};function buildParams(prefix,obj,traditional,add){var name;if(jQuery.isArray(obj)){jQuery.each(obj,function(i,v){if(traditional||rbracket.test(prefix)){add(prefix,v)}else{buildParams(prefix+"["+(typeof v==="object"?i:"")+"]",v,traditional,add)}})}else if(!traditional&&jQuery.type(obj)==="object"){for(name in obj){buildParams(prefix+"["+name+"]",obj[name],traditional,add)}}else{add(prefix,obj)}}var ajaxLocParts,ajaxLocation,rhash=/#.*$/,rheaders=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,rlocalProtocol=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,rnoContent=/^(?:GET|HEAD)$/,rprotocol=/^\/\//,rquery=/\?/,rscript=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,rts=/([?&])_=[^&]*/,rurl=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,_load=jQuery.fn.load,prefilters={},transports={},allTypes=["*/"]+["*"];try{ajaxLocation=location.href}catch(e){ajaxLocation=document.createElement("a");ajaxLocation.href="";ajaxLocation=ajaxLocation.href}ajaxLocParts=rurl.exec(ajaxLocation.toLowerCase())||[];function addToPrefiltersOrTransports(structure){return function(dataTypeExpression,func){if(typeof dataTypeExpression!=="string"){func=dataTypeExpression;dataTypeExpression="*"}var dataType,list,placeBefore,dataTypes=dataTypeExpression.toLowerCase().split(core_rspace),i=0,length=dataTypes.length;if(jQuery.isFunction(func)){for(;i<length;i++){dataType=dataTypes[i];placeBefore=/^\+/.test(dataType);if(placeBefore){dataType=dataType.substr(1)||"*"}list=structure[dataType]=structure[dataType]||[];list[placeBefore?"unshift":"push"](func)}}}}function inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR,dataType,inspected){dataType=dataType||options.dataTypes[0];inspected=inspected||{};inspected[dataType]=true;var selection,list=structure[dataType],i=0,length=list?list.length:0,executeOnly=structure===prefilters;for(;i<length&&(executeOnly||!selection);i++){selection=list[i](options,originalOptions,jqXHR);if(typeof selection==="string"){if(!executeOnly||inspected[selection]){selection=undefined}else{options.dataTypes.unshift(selection);selection=inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR,selection,inspected)}}}if((executeOnly||!selection)&&!inspected["*"]){selection=inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR,"*",inspected)}return selection}function ajaxExtend(target,src){var key,deep,flatOptions=jQuery.ajaxSettings.flatOptions||{};for(key in src){if(src[key]!==undefined){(flatOptions[key]?target:deep||(deep={}))[key]=src[key]}}if(deep){jQuery.extend(true,target,deep)}}jQuery.fn.load=function(url,params,callback){if(typeof url!=="string"&&_load){return _load.apply(this,arguments)}if(!this.length){return this}var selector,type,response,self=this,off=url.indexOf(" ");if(off>=0){selector=url.slice(off,url.length);url=url.slice(0,off)}if(jQuery.isFunction(params)){callback=params;params=undefined}else if(params&&typeof params==="object"){type="POST"}jQuery.ajax({url:url,type:type,dataType:"html",data:params,complete:function(jqXHR,status){if(callback){self.each(callback,response||[jqXHR.responseText,status,jqXHR])}}}).done(function(responseText){response=arguments;self.html(selector?jQuery("<div>").append(responseText.replace(rscript,"")).find(selector):responseText)});return this};jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(i,o){jQuery.fn[o]=function(f){return this.on(o,f)}});jQuery.each(["get","post"],function(i,method){jQuery[method]=function(url,data,callback,type){if(jQuery.isFunction(data)){type=type||callback;callback=data;data=undefined}return jQuery.ajax({type:method,url:url,data:data,success:callback,dataType:type})}});jQuery.extend({getScript:function(url,callback){return jQuery.get(url,undefined,callback,"script")},getJSON:function(url,data,callback){return jQuery.get(url,data,callback,"json")},ajaxSetup:function(target,settings){if(settings){ajaxExtend(target,jQuery.ajaxSettings)}else{settings=target;target=jQuery.ajaxSettings}ajaxExtend(target,settings);return target},ajaxSettings:{url:ajaxLocation,isLocal:rlocalProtocol.test(ajaxLocParts[1]),global:true,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:true,async:true,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":allTypes},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":window.String,"text html":true,"text json":jQuery.parseJSON,"text xml":jQuery.parseXML},flatOptions:{context:true,url:true}},ajaxPrefilter:addToPrefiltersOrTransports(prefilters),ajaxTransport:addToPrefiltersOrTransports(transports),ajax:function(url,options){if(typeof url==="object"){options=url;url=undefined}options=options||{};var ifModifiedKey,responseHeadersString,responseHeaders,transport,timeoutTimer,parts,fireGlobals,i,s=jQuery.ajaxSetup({},options),callbackContext=s.context||s,globalEventContext=callbackContext!==s&&(callbackContext.nodeType||callbackContext instanceof jQuery)?jQuery(callbackContext):jQuery.event,deferred=jQuery.Deferred(),completeDeferred=jQuery.Callbacks("once memory"),statusCode=s.statusCode||{},requestHeaders={},requestHeadersNames={},state=0,strAbort="canceled",jqXHR={readyState:0,setRequestHeader:function(name,value){if(!state){var lname=name.toLowerCase();name=requestHeadersNames[lname]=requestHeadersNames[lname]||name;requestHeaders[name]=value}return this},getAllResponseHeaders:function(){return state===2?responseHeadersString:null},getResponseHeader:function(key){var match;if(state===2){if(!responseHeaders){responseHeaders={};while(match=rheaders.exec(responseHeadersString)){responseHeaders[match[1].toLowerCase()]=match[2]}}match=responseHeaders[key.toLowerCase()]}return match===undefined?null:match},overrideMimeType:function(type){if(!state){s.mimeType=type}return this},abort:function(statusText){statusText=statusText||strAbort;if(transport){transport.abort(statusText)}done(0,statusText);return this}};function done(status,nativeStatusText,responses,headers){var isSuccess,success,error,response,modified,statusText=nativeStatusText;if(state===2){return}state=2;if(timeoutTimer){clearTimeout(timeoutTimer)}transport=undefined;responseHeadersString=headers||"";jqXHR.readyState=status>0?4:0;if(responses){response=ajaxHandleResponses(s,jqXHR,responses)}if(status>=200&&status<300||status===304){if(s.ifModified){modified=jqXHR.getResponseHeader("Last-Modified");if(modified){jQuery.lastModified[ifModifiedKey]=modified}modified=jqXHR.getResponseHeader("Etag");if(modified){jQuery.etag[ifModifiedKey]=modified}}if(status===304){statusText="notmodified";isSuccess=true}else{isSuccess=ajaxConvert(s,response);statusText=isSuccess.state;success=isSuccess.data;error=isSuccess.error;isSuccess=!error}}else{error=statusText;if(!statusText||status){statusText="error";if(status<0){status=0}}}jqXHR.status=status;jqXHR.statusText=(nativeStatusText||statusText)+"";if(isSuccess){deferred.resolveWith(callbackContext,[success,statusText,jqXHR])}else{deferred.rejectWith(callbackContext,[jqXHR,statusText,error])}jqXHR.statusCode(statusCode);statusCode=undefined;if(fireGlobals){globalEventContext.trigger("ajax"+(isSuccess?"Success":"Error"),[jqXHR,s,isSuccess?success:error])}completeDeferred.fireWith(callbackContext,[jqXHR,statusText]);if(fireGlobals){globalEventContext.trigger("ajaxComplete",[jqXHR,s]);if(!--jQuery.active){jQuery.event.trigger("ajaxStop")}}}deferred.promise(jqXHR);jqXHR.success=jqXHR.done;jqXHR.error=jqXHR.fail;jqXHR.complete=completeDeferred.add;jqXHR.statusCode=function(map){if(map){var tmp;if(state<2){for(tmp in map){statusCode[tmp]=[statusCode[tmp],map[tmp]]}}else{tmp=map[jqXHR.status];jqXHR.always(tmp)}}return this};s.url=((url||s.url)+"").replace(rhash,"").replace(rprotocol,ajaxLocParts[1]+"//");s.dataTypes=jQuery.trim(s.dataType||"*").toLowerCase().split(core_rspace);if(s.crossDomain==null){parts=rurl.exec(s.url.toLowerCase());s.crossDomain=!!(parts&&(parts[1]!==ajaxLocParts[1]||parts[2]!==ajaxLocParts[2]||(parts[3]||(parts[1]==="http:"?80:443))!=(ajaxLocParts[3]||(ajaxLocParts[1]==="http:"?80:443))))}if(s.data&&s.processData&&typeof s.data!=="string"){s.data=jQuery.param(s.data,s.traditional)}inspectPrefiltersOrTransports(prefilters,s,options,jqXHR);if(state===2){return jqXHR}fireGlobals=s.global;s.type=s.type.toUpperCase();s.hasContent=!rnoContent.test(s.type);if(fireGlobals&&jQuery.active++===0){jQuery.event.trigger("ajaxStart")}if(!s.hasContent){if(s.data){s.url+=(rquery.test(s.url)?"&":"?")+s.data;delete s.data}ifModifiedKey=s.url;if(s.cache===false){var ts=jQuery.now(),ret=s.url.replace(rts,"$1_="+ts);s.url=ret+(ret===s.url?(rquery.test(s.url)?"&":"?")+"_="+ts:"")}}if(s.data&&s.hasContent&&s.contentType!==false||options.contentType){jqXHR.setRequestHeader("Content-Type",s.contentType)}if(s.ifModified){ifModifiedKey=ifModifiedKey||s.url;if(jQuery.lastModified[ifModifiedKey]){jqXHR.setRequestHeader("If-Modified-Since",jQuery.lastModified[ifModifiedKey])}if(jQuery.etag[ifModifiedKey]){jqXHR.setRequestHeader("If-None-Match",jQuery.etag[ifModifiedKey])}}jqXHR.setRequestHeader("Accept",s.dataTypes[0]&&s.accepts[s.dataTypes[0]]?s.accepts[s.dataTypes[0]]+(s.dataTypes[0]!=="*"?", "+allTypes+"; q=0.01":""):s.accepts["*"]);for(i in s.headers){jqXHR.setRequestHeader(i,s.headers[i])}if(s.beforeSend&&(s.beforeSend.call(callbackContext,jqXHR,s)===false||state===2)){return jqXHR.abort()}strAbort="abort";for(i in{success:1,error:1,complete:1}){jqXHR[i](s[i])}transport=inspectPrefiltersOrTransports(transports,s,options,jqXHR);if(!transport){done(-1,"No Transport")}else{jqXHR.readyState=1;if(fireGlobals){globalEventContext.trigger("ajaxSend",[jqXHR,s])}if(s.async&&s.timeout>0){timeoutTimer=setTimeout(function(){jqXHR.abort("timeout")},s.timeout)}try{state=1;transport.send(requestHeaders,done)}catch(e){if(state<2){done(-1,e)}else{throw e}}}return jqXHR},active:0,lastModified:{},etag:{}});function ajaxHandleResponses(s,jqXHR,responses){var ct,type,finalDataType,firstDataType,contents=s.contents,dataTypes=s.dataTypes,responseFields=s.responseFields;for(type in responseFields){if(type in responses){jqXHR[responseFields[type]]=responses[type]}}while(dataTypes[0]==="*"){dataTypes.shift();if(ct===undefined){ct=s.mimeType||jqXHR.getResponseHeader("content-type")}}if(ct){for(type in contents){if(contents[type]&&contents[type].test(ct)){dataTypes.unshift(type);break}}}if(dataTypes[0]in responses){finalDataType=dataTypes[0]}else{for(type in responses){if(!dataTypes[0]||s.converters[type+" "+dataTypes[0]]){finalDataType=type;break}if(!firstDataType){firstDataType=type}}finalDataType=finalDataType||firstDataType}if(finalDataType){if(finalDataType!==dataTypes[0]){dataTypes.unshift(finalDataType)}return responses[finalDataType]}}function ajaxConvert(s,response){var conv,conv2,current,tmp,dataTypes=s.dataTypes.slice(),prev=dataTypes[0],converters={},i=0;if(s.dataFilter){response=s.dataFilter(response,s.dataType)}if(dataTypes[1]){for(conv in s.converters){converters[conv.toLowerCase()]=s.converters[conv]}}for(;current=dataTypes[++i];){if(current!=="*"){if(prev!=="*"&&prev!==current){conv=converters[prev+" "+current]||converters["* "+current];if(!conv){for(conv2 in converters){tmp=conv2.split(" ");if(tmp[1]===current){conv=converters[prev+" "+tmp[0]]||converters["* "+tmp[0]];if(conv){if(conv===true){conv=converters[conv2]}else if(converters[conv2]!==true){current=tmp[0];dataTypes.splice(i--,0,current)}break}}}}if(conv!==true){if(conv&&s["throws"]){response=conv(response)}else{try{response=conv(response)}catch(e){return{state:"parsererror",error:conv?e:"No conversion from "+prev+" to "+current}}}}}prev=current}}return{state:"success",data:response}}var oldCallbacks=[],rquestion=/\?/,rjsonp=/(=)\?(?=&|$)|\?\?/,nonce=jQuery.now();jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var callback=oldCallbacks.pop()||jQuery.expando+"_"+nonce++;this[callback]=true;return callback}});jQuery.ajaxPrefilter("json jsonp",function(s,originalSettings,jqXHR){var callbackName,overwritten,responseContainer,data=s.data,url=s.url,hasCallback=s.jsonp!==false,replaceInUrl=hasCallback&&rjsonp.test(url),replaceInData=hasCallback&&!replaceInUrl&&typeof data==="string"&&!(s.contentType||"").indexOf("application/x-www-form-urlencoded")&&rjsonp.test(data);if(s.dataTypes[0]==="jsonp"||replaceInUrl||replaceInData){callbackName=s.jsonpCallback=jQuery.isFunction(s.jsonpCallback)?s.jsonpCallback():s.jsonpCallback;overwritten=window[callbackName];if(replaceInUrl){s.url=url.replace(rjsonp,"$1"+callbackName)}else if(replaceInData){s.data=data.replace(rjsonp,"$1"+callbackName)}else if(hasCallback){s.url+=(rquestion.test(url)?"&":"?")+s.jsonp+"="+callbackName}s.converters["script json"]=function(){if(!responseContainer){jQuery.error(callbackName+" was not called")}return responseContainer[0]};s.dataTypes[0]="json";window[callbackName]=function(){responseContainer=arguments};jqXHR.always(function(){window[callbackName]=overwritten;if(s[callbackName]){s.jsonpCallback=originalSettings.jsonpCallback;oldCallbacks.push(callbackName)}if(responseContainer&&jQuery.isFunction(overwritten)){overwritten(responseContainer[0])}responseContainer=overwritten=undefined});return"script"}});jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(text){jQuery.globalEval(text);return text}}});jQuery.ajaxPrefilter("script",function(s){if(s.cache===undefined){s.cache=false}if(s.crossDomain){s.type="GET";s.global=false}});jQuery.ajaxTransport("script",function(s){if(s.crossDomain){var script,head=document.head||document.getElementsByTagName("head")[0]||document.documentElement;return{send:function(_,callback){script=document.createElement("script");script.async="async";if(s.scriptCharset){script.charset=s.scriptCharset}script.src=s.url;script.onload=script.onreadystatechange=function(_,isAbort){if(isAbort||!script.readyState||/loaded|complete/.test(script.readyState)){script.onload=script.onreadystatechange=null;if(head&&script.parentNode){head.removeChild(script)}script=undefined;if(!isAbort){callback(200,"success")}}};head.insertBefore(script,head.firstChild)},abort:function(){if(script){script.onload(0,1)}}}}});var xhrCallbacks,xhrOnUnloadAbort=window.ActiveXObject?function(){for(var key in xhrCallbacks){xhrCallbacks[key](0,1)}}:false,xhrId=0;function createStandardXHR(){try{return new window.XMLHttpRequest}catch(e){}}function createActiveXHR(){try{return new window.ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}jQuery.ajaxSettings.xhr=window.ActiveXObject?function(){return!this.isLocal&&createStandardXHR()||createActiveXHR()}:createStandardXHR;(function(xhr){jQuery.extend(jQuery.support,{ajax:!!xhr,cors:!!xhr&&"withCredentials"in xhr})})(jQuery.ajaxSettings.xhr());if(jQuery.support.ajax){jQuery.ajaxTransport(function(s){if(!s.crossDomain||jQuery.support.cors){var callback;return{send:function(headers,complete){var handle,i,xhr=s.xhr();if(s.username){xhr.open(s.type,s.url,s.async,s.username,s.password)}else{xhr.open(s.type,s.url,s.async)}if(s.xhrFields){for(i in s.xhrFields){xhr[i]=s.xhrFields[i]}}if(s.mimeType&&xhr.overrideMimeType){xhr.overrideMimeType(s.mimeType)}if(!s.crossDomain&&!headers["X-Requested-With"]){headers["X-Requested-With"]="XMLHttpRequest"}try{for(i in headers){xhr.setRequestHeader(i,headers[i])}}catch(_){}xhr.send(s.hasContent&&s.data||null);callback=function(_,isAbort){var status,statusText,responseHeaders,responses,xml;try{if(callback&&(isAbort||xhr.readyState===4)){callback=undefined;if(handle){xhr.onreadystatechange=jQuery.noop;if(xhrOnUnloadAbort){delete xhrCallbacks[handle]}}if(isAbort){if(xhr.readyState!==4){xhr.abort()}}else{status=xhr.status;responseHeaders=xhr.getAllResponseHeaders();responses={};xml=xhr.responseXML;if(xml&&xml.documentElement){responses.xml=xml}try{responses.text=xhr.responseText}catch(e){}try{statusText=xhr.statusText}catch(e){statusText=""}if(!status&&s.isLocal&&!s.crossDomain){status=responses.text?200:404}else if(status===1223){status=204}}}}catch(firefoxAccessException){if(!isAbort){complete(-1,firefoxAccessException)
}}if(responses){complete(status,statusText,responses,responseHeaders)}};if(!s.async){callback()}else if(xhr.readyState===4){setTimeout(callback,0)}else{handle=++xhrId;if(xhrOnUnloadAbort){if(!xhrCallbacks){xhrCallbacks={};jQuery(window).unload(xhrOnUnloadAbort)}xhrCallbacks[handle]=callback}xhr.onreadystatechange=callback}},abort:function(){if(callback){callback(0,1)}}}}})}var fxNow,timerId,rfxtypes=/^(?:toggle|show|hide)$/,rfxnum=new RegExp("^(?:([-+])=|)("+core_pnum+")([a-z%]*)$","i"),rrun=/queueHooks$/,animationPrefilters=[defaultPrefilter],tweeners={"*":[function(prop,value){var end,unit,tween=this.createTween(prop,value),parts=rfxnum.exec(value),target=tween.cur(),start=+target||0,scale=1,maxIterations=20;if(parts){end=+parts[2];unit=parts[3]||(jQuery.cssNumber[prop]?"":"px");if(unit!=="px"&&start){start=jQuery.css(tween.elem,prop,true)||end||1;do{scale=scale||".5";start=start/scale;jQuery.style(tween.elem,prop,start+unit)}while(scale!==(scale=tween.cur()/target)&&scale!==1&&--maxIterations)}tween.unit=unit;tween.start=start;tween.end=parts[1]?start+(parts[1]+1)*end:end}return tween}]};function createFxNow(){setTimeout(function(){fxNow=undefined},0);return fxNow=jQuery.now()}function createTweens(animation,props){jQuery.each(props,function(prop,value){var collection=(tweeners[prop]||[]).concat(tweeners["*"]),index=0,length=collection.length;for(;index<length;index++){if(collection[index].call(animation,prop,value)){return}}})}function Animation(elem,properties,options){var result,index=0,tweenerIndex=0,length=animationPrefilters.length,deferred=jQuery.Deferred().always(function(){delete tick.elem}),tick=function(){var currentTime=fxNow||createFxNow(),remaining=Math.max(0,animation.startTime+animation.duration-currentTime),temp=remaining/animation.duration||0,percent=1-temp,index=0,length=animation.tweens.length;for(;index<length;index++){animation.tweens[index].run(percent)}deferred.notifyWith(elem,[animation,percent,remaining]);if(percent<1&&length){return remaining}else{deferred.resolveWith(elem,[animation]);return false}},animation=deferred.promise({elem:elem,props:jQuery.extend({},properties),opts:jQuery.extend(true,{specialEasing:{}},options),originalProperties:properties,originalOptions:options,startTime:fxNow||createFxNow(),duration:options.duration,tweens:[],createTween:function(prop,end,easing){var tween=jQuery.Tween(elem,animation.opts,prop,end,animation.opts.specialEasing[prop]||animation.opts.easing);animation.tweens.push(tween);return tween},stop:function(gotoEnd){var index=0,length=gotoEnd?animation.tweens.length:0;for(;index<length;index++){animation.tweens[index].run(1)}if(gotoEnd){deferred.resolveWith(elem,[animation,gotoEnd])}else{deferred.rejectWith(elem,[animation,gotoEnd])}return this}}),props=animation.props;propFilter(props,animation.opts.specialEasing);for(;index<length;index++){result=animationPrefilters[index].call(animation,elem,props,animation.opts);if(result){return result}}createTweens(animation,props);if(jQuery.isFunction(animation.opts.start)){animation.opts.start.call(elem,animation)}jQuery.fx.timer(jQuery.extend(tick,{anim:animation,queue:animation.opts.queue,elem:elem}));return animation.progress(animation.opts.progress).done(animation.opts.done,animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always)}function propFilter(props,specialEasing){var index,name,easing,value,hooks;for(index in props){name=jQuery.camelCase(index);easing=specialEasing[name];value=props[index];if(jQuery.isArray(value)){easing=value[1];value=props[index]=value[0]}if(index!==name){props[name]=value;delete props[index]}hooks=jQuery.cssHooks[name];if(hooks&&"expand"in hooks){value=hooks.expand(value);delete props[name];for(index in value){if(!(index in props)){props[index]=value[index];specialEasing[index]=easing}}}else{specialEasing[name]=easing}}}jQuery.Animation=jQuery.extend(Animation,{tweener:function(props,callback){if(jQuery.isFunction(props)){callback=props;props=["*"]}else{props=props.split(" ")}var prop,index=0,length=props.length;for(;index<length;index++){prop=props[index];tweeners[prop]=tweeners[prop]||[];tweeners[prop].unshift(callback)}},prefilter:function(callback,prepend){if(prepend){animationPrefilters.unshift(callback)}else{animationPrefilters.push(callback)}}});function defaultPrefilter(elem,props,opts){var index,prop,value,length,dataShow,toggle,tween,hooks,oldfire,anim=this,style=elem.style,orig={},handled=[],hidden=elem.nodeType&&isHidden(elem);if(!opts.queue){hooks=jQuery._queueHooks(elem,"fx");if(hooks.unqueued==null){hooks.unqueued=0;oldfire=hooks.empty.fire;hooks.empty.fire=function(){if(!hooks.unqueued){oldfire()}}}hooks.unqueued++;anim.always(function(){anim.always(function(){hooks.unqueued--;if(!jQuery.queue(elem,"fx").length){hooks.empty.fire()}})})}if(elem.nodeType===1&&("height"in props||"width"in props)){opts.overflow=[style.overflow,style.overflowX,style.overflowY];if(jQuery.css(elem,"display")==="inline"&&jQuery.css(elem,"float")==="none"){if(!jQuery.support.inlineBlockNeedsLayout||css_defaultDisplay(elem.nodeName)==="inline"){style.display="inline-block"}else{style.zoom=1}}}if(opts.overflow){style.overflow="hidden";if(!jQuery.support.shrinkWrapBlocks){anim.done(function(){style.overflow=opts.overflow[0];style.overflowX=opts.overflow[1];style.overflowY=opts.overflow[2]})}}for(index in props){value=props[index];if(rfxtypes.exec(value)){delete props[index];toggle=toggle||value==="toggle";if(value===(hidden?"hide":"show")){continue}handled.push(index)}}length=handled.length;if(length){dataShow=jQuery._data(elem,"fxshow")||jQuery._data(elem,"fxshow",{});if("hidden"in dataShow){hidden=dataShow.hidden}if(toggle){dataShow.hidden=!hidden}if(hidden){jQuery(elem).show()}else{anim.done(function(){jQuery(elem).hide()})}anim.done(function(){var prop;jQuery.removeData(elem,"fxshow",true);for(prop in orig){jQuery.style(elem,prop,orig[prop])}});for(index=0;index<length;index++){prop=handled[index];tween=anim.createTween(prop,hidden?dataShow[prop]:0);orig[prop]=dataShow[prop]||jQuery.style(elem,prop);if(!(prop in dataShow)){dataShow[prop]=tween.start;if(hidden){tween.end=tween.start;tween.start=prop==="width"||prop==="height"?1:0}}}}}function Tween(elem,options,prop,end,easing){return new Tween.prototype.init(elem,options,prop,end,easing)}jQuery.Tween=Tween;Tween.prototype={constructor:Tween,init:function(elem,options,prop,end,easing,unit){this.elem=elem;this.prop=prop;this.easing=easing||"swing";this.options=options;this.start=this.now=this.cur();this.end=end;this.unit=unit||(jQuery.cssNumber[prop]?"":"px")},cur:function(){var hooks=Tween.propHooks[this.prop];return hooks&&hooks.get?hooks.get(this):Tween.propHooks._default.get(this)},run:function(percent){var eased,hooks=Tween.propHooks[this.prop];if(this.options.duration){this.pos=eased=jQuery.easing[this.easing](percent,this.options.duration*percent,0,1,this.options.duration)}else{this.pos=eased=percent}this.now=(this.end-this.start)*eased+this.start;if(this.options.step){this.options.step.call(this.elem,this.now,this)}if(hooks&&hooks.set){hooks.set(this)}else{Tween.propHooks._default.set(this)}return this}};Tween.prototype.init.prototype=Tween.prototype;Tween.propHooks={_default:{get:function(tween){var result;if(tween.elem[tween.prop]!=null&&(!tween.elem.style||tween.elem.style[tween.prop]==null)){return tween.elem[tween.prop]}result=jQuery.css(tween.elem,tween.prop,false,"");return!result||result==="auto"?0:result},set:function(tween){if(jQuery.fx.step[tween.prop]){jQuery.fx.step[tween.prop](tween)}else if(tween.elem.style&&(tween.elem.style[jQuery.cssProps[tween.prop]]!=null||jQuery.cssHooks[tween.prop])){jQuery.style(tween.elem,tween.prop,tween.now+tween.unit)}else{tween.elem[tween.prop]=tween.now}}}};Tween.propHooks.scrollTop=Tween.propHooks.scrollLeft={set:function(tween){if(tween.elem.nodeType&&tween.elem.parentNode){tween.elem[tween.prop]=tween.now}}};jQuery.each(["toggle","show","hide"],function(i,name){var cssFn=jQuery.fn[name];jQuery.fn[name]=function(speed,easing,callback){return speed==null||typeof speed==="boolean"||!i&&jQuery.isFunction(speed)&&jQuery.isFunction(easing)?cssFn.apply(this,arguments):this.animate(genFx(name,true),speed,easing,callback)}});jQuery.fn.extend({fadeTo:function(speed,to,easing,callback){return this.filter(isHidden).css("opacity",0).show().end().animate({opacity:to},speed,easing,callback)},animate:function(prop,speed,easing,callback){var empty=jQuery.isEmptyObject(prop),optall=jQuery.speed(speed,easing,callback),doAnimation=function(){var anim=Animation(this,jQuery.extend({},prop),optall);if(empty){anim.stop(true)}};return empty||optall.queue===false?this.each(doAnimation):this.queue(optall.queue,doAnimation)},stop:function(type,clearQueue,gotoEnd){var stopQueue=function(hooks){var stop=hooks.stop;delete hooks.stop;stop(gotoEnd)};if(typeof type!=="string"){gotoEnd=clearQueue;clearQueue=type;type=undefined}if(clearQueue&&type!==false){this.queue(type||"fx",[])}return this.each(function(){var dequeue=true,index=type!=null&&type+"queueHooks",timers=jQuery.timers,data=jQuery._data(this);if(index){if(data[index]&&data[index].stop){stopQueue(data[index])}}else{for(index in data){if(data[index]&&data[index].stop&&rrun.test(index)){stopQueue(data[index])}}}for(index=timers.length;index--;){if(timers[index].elem===this&&(type==null||timers[index].queue===type)){timers[index].anim.stop(gotoEnd);dequeue=false;timers.splice(index,1)}}if(dequeue||!gotoEnd){jQuery.dequeue(this,type)}})}});function genFx(type,includeWidth){var which,attrs={height:type},i=0;includeWidth=includeWidth?1:0;for(;i<4;i+=2-includeWidth){which=cssExpand[i];attrs["margin"+which]=attrs["padding"+which]=type}if(includeWidth){attrs.opacity=attrs.width=type}return attrs}jQuery.each({slideDown:genFx("show"),slideUp:genFx("hide"),slideToggle:genFx("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(name,props){jQuery.fn[name]=function(speed,easing,callback){return this.animate(props,speed,easing,callback)}});jQuery.speed=function(speed,easing,fn){var opt=speed&&typeof speed==="object"?jQuery.extend({},speed):{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&!jQuery.isFunction(easing)&&easing};opt.duration=jQuery.fx.off?0:typeof opt.duration==="number"?opt.duration:opt.duration in jQuery.fx.speeds?jQuery.fx.speeds[opt.duration]:jQuery.fx.speeds._default;if(opt.queue==null||opt.queue===true){opt.queue="fx"}opt.old=opt.complete;opt.complete=function(){if(jQuery.isFunction(opt.old)){opt.old.call(this)}if(opt.queue){jQuery.dequeue(this,opt.queue)}};return opt};jQuery.easing={linear:function(p){return p},swing:function(p){return.5-Math.cos(p*Math.PI)/2}};jQuery.timers=[];jQuery.fx=Tween.prototype.init;jQuery.fx.tick=function(){var timer,timers=jQuery.timers,i=0;fxNow=jQuery.now();for(;i<timers.length;i++){timer=timers[i];if(!timer()&&timers[i]===timer){timers.splice(i--,1)}}if(!timers.length){jQuery.fx.stop()}fxNow=undefined};jQuery.fx.timer=function(timer){if(timer()&&jQuery.timers.push(timer)&&!timerId){timerId=setInterval(jQuery.fx.tick,jQuery.fx.interval)}};jQuery.fx.interval=13;jQuery.fx.stop=function(){clearInterval(timerId);timerId=null};jQuery.fx.speeds={slow:600,fast:200,_default:400};jQuery.fx.step={};if(jQuery.expr&&jQuery.expr.filters){jQuery.expr.filters.animated=function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem===fn.elem}).length}}var rroot=/^(?:body|html)$/i;jQuery.fn.offset=function(options){if(arguments.length){return options===undefined?this:this.each(function(i){jQuery.offset.setOffset(this,options,i)})}var docElem,body,win,clientTop,clientLeft,scrollTop,scrollLeft,box={top:0,left:0},elem=this[0],doc=elem&&elem.ownerDocument;if(!doc){return}if((body=doc.body)===elem){return jQuery.offset.bodyOffset(elem)}docElem=doc.documentElement;if(!jQuery.contains(docElem,elem)){return box}if(typeof elem.getBoundingClientRect!=="undefined"){box=elem.getBoundingClientRect()}win=getWindow(doc);clientTop=docElem.clientTop||body.clientTop||0;clientLeft=docElem.clientLeft||body.clientLeft||0;scrollTop=win.pageYOffset||docElem.scrollTop;scrollLeft=win.pageXOffset||docElem.scrollLeft;return{top:box.top+scrollTop-clientTop,left:box.left+scrollLeft-clientLeft}};jQuery.offset={bodyOffset:function(body){var top=body.offsetTop,left=body.offsetLeft;if(jQuery.support.doesNotIncludeMarginInBodyOffset){top+=parseFloat(jQuery.css(body,"marginTop"))||0;left+=parseFloat(jQuery.css(body,"marginLeft"))||0}return{top:top,left:left}},setOffset:function(elem,options,i){var position=jQuery.css(elem,"position");if(position==="static"){elem.style.position="relative"}var curElem=jQuery(elem),curOffset=curElem.offset(),curCSSTop=jQuery.css(elem,"top"),curCSSLeft=jQuery.css(elem,"left"),calculatePosition=(position==="absolute"||position==="fixed")&&jQuery.inArray("auto",[curCSSTop,curCSSLeft])>-1,props={},curPosition={},curTop,curLeft;if(calculatePosition){curPosition=curElem.position();curTop=curPosition.top;curLeft=curPosition.left}else{curTop=parseFloat(curCSSTop)||0;curLeft=parseFloat(curCSSLeft)||0}if(jQuery.isFunction(options)){options=options.call(elem,i,curOffset)}if(options.top!=null){props.top=options.top-curOffset.top+curTop}if(options.left!=null){props.left=options.left-curOffset.left+curLeft}if("using"in options){options.using.call(elem,props)}else{curElem.css(props)}}};jQuery.fn.extend({position:function(){if(!this[0]){return}var elem=this[0],offsetParent=this.offsetParent(),offset=this.offset(),parentOffset=rroot.test(offsetParent[0].nodeName)?{top:0,left:0}:offsetParent.offset();offset.top-=parseFloat(jQuery.css(elem,"marginTop"))||0;offset.left-=parseFloat(jQuery.css(elem,"marginLeft"))||0;parentOffset.top+=parseFloat(jQuery.css(offsetParent[0],"borderTopWidth"))||0;parentOffset.left+=parseFloat(jQuery.css(offsetParent[0],"borderLeftWidth"))||0;return{top:offset.top-parentOffset.top,left:offset.left-parentOffset.left}},offsetParent:function(){return this.map(function(){var offsetParent=this.offsetParent||document.body;while(offsetParent&&!rroot.test(offsetParent.nodeName)&&jQuery.css(offsetParent,"position")==="static"){offsetParent=offsetParent.offsetParent}return offsetParent||document.body})}});jQuery.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(method,prop){var top=/Y/.test(prop);jQuery.fn[method]=function(val){return jQuery.access(this,function(elem,method,val){var win=getWindow(elem);if(val===undefined){return win?prop in win?win[prop]:win.document.documentElement[method]:elem[method]}if(win){win.scrollTo(!top?val:jQuery(win).scrollLeft(),top?val:jQuery(win).scrollTop())}else{elem[method]=val}},method,val,arguments.length,null)}});function getWindow(elem){return jQuery.isWindow(elem)?elem:elem.nodeType===9?elem.defaultView||elem.parentWindow:false}jQuery.each({Height:"height",Width:"width"},function(name,type){jQuery.each({padding:"inner"+name,content:type,"":"outer"+name},function(defaultExtra,funcName){jQuery.fn[funcName]=function(margin,value){var chainable=arguments.length&&(defaultExtra||typeof margin!=="boolean"),extra=defaultExtra||(margin===true||value===true?"margin":"border");return jQuery.access(this,function(elem,type,value){var doc;if(jQuery.isWindow(elem)){return elem.document.documentElement["client"+name]}if(elem.nodeType===9){doc=elem.documentElement;return Math.max(elem.body["scroll"+name],doc["scroll"+name],elem.body["offset"+name],doc["offset"+name],doc["client"+name])}return value===undefined?jQuery.css(elem,type,value,extra):jQuery.style(elem,type,value,extra)},type,chainable?margin:undefined,chainable,null)}})});window.jQuery=window.$=jQuery;if(typeof define==="function"&&define.amd&&define.amd.jQuery){define("jquery",[],function(){return jQuery})}})(window);
/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("requireLib", function(){});

/**
 * Sinon.JS 1.5.0, 2012/10/19
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @author Contributors: https://github.com/cjohansen/Sinon.JS/blob/master/AUTHORS
 *
 * (The BSD License)
 * 
 * Copyright (c) 2010-2012, Christian Johansen, christian@cjohansen.no
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 *     * Neither the name of Christian Johansen nor the names of his contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var sinon = (function () {


var buster = (function (setTimeout, B) {
    var isNode = typeof require == "function" && typeof module == "object";
    var div = typeof document != "undefined" && document.createElement("div");
    var F = function () {};

    var buster = {
        bind: function bind(obj, methOrProp) {
            var method = typeof methOrProp == "string" ? obj[methOrProp] : methOrProp;
            var args = Array.prototype.slice.call(arguments, 2);
            return function () {
                var allArgs = args.concat(Array.prototype.slice.call(arguments));
                return method.apply(obj, allArgs);
            };
        },

        partial: function partial(fn) {
            var args = [].slice.call(arguments, 1);
            return function () {
                return fn.apply(this, args.concat([].slice.call(arguments)));
            };
        },

        create: function create(object) {
            F.prototype = object;
            return new F();
        },

        extend: function extend(target) {
            if (!target) { return; }
            for (var i = 1, l = arguments.length, prop; i < l; ++i) {
                for (prop in arguments[i]) {
                    target[prop] = arguments[i][prop];
                }
            }
            return target;
        },

        nextTick: function nextTick(callback) {
            if (typeof process != "undefined" && process.nextTick) {
                return process.nextTick(callback);
            }
            setTimeout(callback, 0);
        },

        functionName: function functionName(func) {
            if (!func) return "";
            if (func.displayName) return func.displayName;
            if (func.name) return func.name;
            var matches = func.toString().match(/function\s+([^\(]+)/m);
            return matches && matches[1] || "";
        },

        isNode: function isNode(obj) {
            if (!div) return false;
            try {
                obj.appendChild(div);
                obj.removeChild(div);
            } catch (e) {
                return false;
            }
            return true;
        },

        isElement: function isElement(obj) {
            return obj && obj.nodeType === 1 && buster.isNode(obj);
        },

        isArray: function isArray(arr) {
            return Object.prototype.toString.call(arr) == "[object Array]";
        },

        flatten: function flatten(arr) {
            var result = [], arr = arr || [];
            for (var i = 0, l = arr.length; i < l; ++i) {
                result = result.concat(buster.isArray(arr[i]) ? flatten(arr[i]) : arr[i]);
            }
            return result;
        },

        each: function each(arr, callback) {
            for (var i = 0, l = arr.length; i < l; ++i) {
                callback(arr[i]);
            }
        },

        map: function map(arr, callback) {
            var results = [];
            for (var i = 0, l = arr.length; i < l; ++i) {
                results.push(callback(arr[i]));
            }
            return results;
        },

        parallel: function parallel(fns, callback) {
            function cb(err, res) {
                if (typeof callback == "function") {
                    callback(err, res);
                    callback = null;
                }
            }
            if (fns.length == 0) { return cb(null, []); }
            var remaining = fns.length, results = [];
            function makeDone(num) {
                return function done(err, result) {
                    if (err) { return cb(err); }
                    results[num] = result;
                    if (--remaining == 0) { cb(null, results); }
                };
            }
            for (var i = 0, l = fns.length; i < l; ++i) {
                fns[i](makeDone(i));
            }
        },

        series: function series(fns, callback) {
            function cb(err, res) {
                if (typeof callback == "function") {
                    callback(err, res);
                }
            }
            var remaining = fns.slice();
            var results = [];
            function callNext() {
                if (remaining.length == 0) return cb(null, results);
                var promise = remaining.shift()(next);
                if (promise && typeof promise.then == "function") {
                    promise.then(buster.partial(next, null), next);
                }
            }
            function next(err, result) {
                if (err) return cb(err);
                results.push(result);
                callNext();
            }
            callNext();
        },

        countdown: function countdown(num, done) {
            return function () {
                if (--num == 0) done();
            };
        }
    };

    if (typeof process === "object" &&
        typeof require === "function" && typeof module === "object") {
        var crypto = require("crypto");
        var path = require("path");

        buster.tmpFile = function (fileName) {
            var hashed = crypto.createHash("sha1");
            hashed.update(fileName);
            var tmpfileName = hashed.digest("hex");

            if (process.platform == "win32") {
                return path.join(process.env["TEMP"], tmpfileName);
            } else {
                return path.join("/tmp", tmpfileName);
            }
        };
    }

    if (Array.prototype.some) {
        buster.some = function (arr, fn, thisp) {
            return arr.some(fn, thisp);
        };
    } else {
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
        buster.some = function (arr, fun, thisp) {
                        if (arr == null) { throw new TypeError(); }
            arr = Object(arr);
            var len = arr.length >>> 0;
            if (typeof fun !== "function") { throw new TypeError(); }

            for (var i = 0; i < len; i++) {
                if (arr.hasOwnProperty(i) && fun.call(thisp, arr[i], i, arr)) {
                    return true;
                }
            }

            return false;
        };
    }

    if (Array.prototype.filter) {
        buster.filter = function (arr, fn, thisp) {
            return arr.filter(fn, thisp);
        };
    } else {
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
        buster.filter = function (fn, thisp) {
                        if (this == null) { throw new TypeError(); }

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fn != "function") { throw new TypeError(); }

            var res = [];
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i]; // in case fun mutates this
                    if (fn.call(thisp, val, i, t)) { res.push(val); }
                }
            }

            return res;
        };
    }

    if (isNode) {
        module.exports = buster;
        buster.eventEmitter = require("./buster-event-emitter");
        Object.defineProperty(buster, "defineVersionGetter", {
            get: function () {
                return require("./define-version-getter");
            }
        });
    }

    return buster.extend(B || {}, buster);
}(setTimeout, buster));
if (typeof buster === "undefined") {
    var buster = {};
}

if (typeof module === "object" && typeof require === "function") {
    buster = require("buster-core");
}

buster.format = buster.format || {};
buster.format.excludeConstructors = ["Object", /^.$/];
buster.format.quoteStrings = true;

buster.format.ascii = (function () {
    
    var hasOwn = Object.prototype.hasOwnProperty;

    var specialObjects = [];
    if (typeof global != "undefined") {
        specialObjects.push({ obj: global, value: "[object global]" });
    }
    if (typeof document != "undefined") {
        specialObjects.push({ obj: document, value: "[object HTMLDocument]" });
    }
    if (typeof window != "undefined") {
        specialObjects.push({ obj: window, value: "[object Window]" });
    }

    function keys(object) {
        var k = Object.keys && Object.keys(object) || [];

        if (k.length == 0) {
            for (var prop in object) {
                if (hasOwn.call(object, prop)) {
                    k.push(prop);
                }
            }
        }

        return k.sort();
    }

    function isCircular(object, objects) {
        if (typeof object != "object") {
            return false;
        }

        for (var i = 0, l = objects.length; i < l; ++i) {
            if (objects[i] === object) {
                return true;
            }
        }

        return false;
    }

    function ascii(object, processed, indent) {
        if (typeof object == "string") {
            var quote = typeof this.quoteStrings != "boolean" || this.quoteStrings;
            return processed || quote ? '"' + object + '"' : object;
        }

        if (typeof object == "function" && !(object instanceof RegExp)) {
            return ascii.func(object);
        }

        processed = processed || [];

        if (isCircular(object, processed)) {
            return "[Circular]";
        }

        if (Object.prototype.toString.call(object) == "[object Array]") {
            return ascii.array.call(this, object, processed);
        }

        if (!object) {
            return "" + object;
        }

        if (buster.isElement(object)) {
            return ascii.element(object);
        }

        if (typeof object.toString == "function" &&
            object.toString !== Object.prototype.toString) {
            return object.toString();
        }

        for (var i = 0, l = specialObjects.length; i < l; i++) {
            if (object === specialObjects[i].obj) {
                return specialObjects[i].value;
            }
        }

        return ascii.object.call(this, object, processed, indent);
    }

    ascii.func = function (func) {
        return "function " + buster.functionName(func) + "() {}";
    };

    ascii.array = function (array, processed) {
        processed = processed || [];
        processed.push(array);
        var pieces = [];

        for (var i = 0, l = array.length; i < l; ++i) {
            pieces.push(ascii.call(this, array[i], processed));
        }

        return "[" + pieces.join(", ") + "]";
    };

    ascii.object = function (object, processed, indent) {
        processed = processed || [];
        processed.push(object);
        indent = indent || 0;
        var pieces = [], properties = keys(object), prop, str, obj;
        var is = "";
        var length = 3;

        for (var i = 0, l = indent; i < l; ++i) {
            is += " ";
        }

        for (i = 0, l = properties.length; i < l; ++i) {
            prop = properties[i];
            obj = object[prop];

            if (isCircular(obj, processed)) {
                str = "[Circular]";
            } else {
                str = ascii.call(this, obj, processed, indent + 2);
            }

            str = (/\s/.test(prop) ? '"' + prop + '"' : prop) + ": " + str;
            length += str.length;
            pieces.push(str);
        }

        var cons = ascii.constructorName.call(this, object);
        var prefix = cons ? "[" + cons + "] " : ""

        return (length + indent) > 80 ?
            prefix + "{\n  " + is + pieces.join(",\n  " + is) + "\n" + is + "}" :
            prefix + "{ " + pieces.join(", ") + " }";
    };

    ascii.element = function (element) {
        var tagName = element.tagName.toLowerCase();
        var attrs = element.attributes, attribute, pairs = [], attrName;

        for (var i = 0, l = attrs.length; i < l; ++i) {
            attribute = attrs.item(i);
            attrName = attribute.nodeName.toLowerCase().replace("html:", "");

            if (attrName == "contenteditable" && attribute.nodeValue == "inherit") {
                continue;
            }

            if (!!attribute.nodeValue) {
                pairs.push(attrName + "=\"" + attribute.nodeValue + "\"");
            }
        }

        var formatted = "<" + tagName + (pairs.length > 0 ? " " : "");
        var content = element.innerHTML;

        if (content.length > 20) {
            content = content.substr(0, 20) + "[...]";
        }

        var res = formatted + pairs.join(" ") + ">" + content + "</" + tagName + ">";

        return res.replace(/ contentEditable="inherit"/, "");
    };

    ascii.constructorName = function (object) {
        var name = buster.functionName(object && object.constructor);
        var excludes = this.excludeConstructors || buster.format.excludeConstructors || [];

        for (var i = 0, l = excludes.length; i < l; ++i) {
            if (typeof excludes[i] == "string" && excludes[i] == name) {
                return "";
            } else if (excludes[i].test && excludes[i].test(name)) {
                return "";
            }
        }

        return name;
    };

    return ascii;
}());

if (typeof module != "undefined") {
    module.exports = buster.format;
}
/*jslint eqeqeq: false, onevar: false, forin: true, nomen: false, regexp: false, plusplus: false*/
/*global module, require, __dirname, document*/
/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

var sinon = (function (buster) {
    var div = typeof document != "undefined" && document.createElement("div");
    var hasOwn = Object.prototype.hasOwnProperty;

    function isDOMNode(obj) {
        var success = false;

        try {
            obj.appendChild(div);
            success = div.parentNode == obj;
        } catch (e) {
            return false;
        } finally {
            try {
                obj.removeChild(div);
            } catch (e) {
                // Remove failed, not much we can do about that
            }
        }

        return success;
    }

    function isElement(obj) {
        return div && obj && obj.nodeType === 1 && isDOMNode(obj);
    }

    function isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function mirrorProperties(target, source) {
        for (var prop in source) {
            if (!hasOwn.call(target, prop)) {
                target[prop] = source[prop];
            }
        }
    }

    var sinon = {
        wrapMethod: function wrapMethod(object, property, method) {
            if (!object) {
                throw new TypeError("Should wrap property of object");
            }

            if (typeof method != "function") {
                throw new TypeError("Method wrapper should be function");
            }

            var wrappedMethod = object[property];

            if (!isFunction(wrappedMethod)) {
                throw new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                                    property + " as function");
            }

            if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
                throw new TypeError("Attempted to wrap " + property + " which is already wrapped");
            }

            if (wrappedMethod.calledBefore) {
                var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
                throw new TypeError("Attempted to wrap " + property + " which is already " + verb);
            }

            // IE 8 does not support hasOwnProperty on the window object.
            var owned = hasOwn.call(object, property);
            object[property] = method;
            method.displayName = property;

            method.restore = function () {
                // For prototype properties try to reset by delete first.
                // If this fails (ex: localStorage on mobile safari) then force a reset
                // via direct assignment.
                if (!owned) {
                    delete object[property];
                }
                if (object[property] === method) {
                    object[property] = wrappedMethod;
                }
            };

            method.restore.sinon = true;
            mirrorProperties(method, wrappedMethod);

            return method;
        },

        extend: function extend(target) {
            for (var i = 1, l = arguments.length; i < l; i += 1) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop];
                    }

                    // DONT ENUM bug, only care about toString
                    if (arguments[i].hasOwnProperty("toString") &&
                        arguments[i].toString != target.toString) {
                        target.toString = arguments[i].toString;
                    }
                }
            }

            return target;
        },

        create: function create(proto) {
            var F = function () {};
            F.prototype = proto;
            return new F();
        },

        deepEqual: function deepEqual(a, b) {
            if (sinon.match && sinon.match.isMatcher(a)) {
                return a.test(b);
            }
            if (typeof a != "object" || typeof b != "object") {
                return a === b;
            }

            if (isElement(a) || isElement(b)) {
                return a === b;
            }

            if (a === b) {
                return true;
            }

            var aString = Object.prototype.toString.call(a);
            if (aString != Object.prototype.toString.call(b)) {
                return false;
            }

            if (aString == "[object Array]") {
                if (a.length !== b.length) {
                    return false;
                }

                for (var i = 0, l = a.length; i < l; i += 1) {
                    if (!deepEqual(a[i], b[i])) {
                        return false;
                    }
                }

                return true;
            }

            var prop, aLength = 0, bLength = 0;

            for (prop in a) {
                aLength += 1;

                if (!deepEqual(a[prop], b[prop])) {
                    return false;
                }
            }

            for (prop in b) {
                bLength += 1;
            }

            if (aLength != bLength) {
                return false;
            }

            return true;
        },

        functionName: function functionName(func) {
            var name = func.displayName || func.name;

            // Use function decomposition as a last resort to get function
            // name. Does not rely on function decomposition to work - if it
            // doesn't debugging will be slightly less informative
            // (i.e. toString will say 'spy' rather than 'myFunc').
            if (!name) {
                var matches = func.toString().match(/function ([^\s\(]+)/);
                name = matches && matches[1];
            }

            return name;
        },

        functionToString: function toString() {
            if (this.getCall && this.callCount) {
                var thisValue, prop, i = this.callCount;

                while (i--) {
                    thisValue = this.getCall(i).thisValue;

                    for (prop in thisValue) {
                        if (thisValue[prop] === this) {
                            return prop;
                        }
                    }
                }
            }

            return this.displayName || "sinon fake";
        },

        getConfig: function (custom) {
            var config = {};
            custom = custom || {};
            var defaults = sinon.defaultConfig;

            for (var prop in defaults) {
                if (defaults.hasOwnProperty(prop)) {
                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];
                }
            }

            return config;
        },

        format: function (val) {
            return "" + val;
        },

        defaultConfig: {
            injectIntoThis: true,
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        },

        timesInWords: function timesInWords(count) {
            return count == 1 && "once" ||
                count == 2 && "twice" ||
                count == 3 && "thrice" ||
                (count || 0) + " times";
        },

        calledInOrder: function (spies) {
            for (var i = 1, l = spies.length; i < l; i++) {
                if (!spies[i - 1].calledBefore(spies[i])) {
                    return false;
                }
            }

            return true;
        },

        orderByFirstCall: function (spies) {
            return spies.sort(function (a, b) {
                // uuid, won't ever be equal
                var aCall = a.getCall(0);
                var bCall = b.getCall(0);
                var aId = aCall && aCall.callId || -1;
                var bId = bCall && bCall.callId || -1;

                return aId < bId ? -1 : 1;
            });
        },

        log: function () {},

        logError: function (label, err) {
            var msg = label + " threw exception: "
            sinon.log(msg + "[" + err.name + "] " + err.message);
            if (err.stack) { sinon.log(err.stack); }

            setTimeout(function () {
                err.message = msg + err.message;
                throw err;
            }, 0);
        },

        typeOf: function (value) {
            if (value === null) {
              return "null";
            }
            var string = Object.prototype.toString.call(value);
            return string.substring(8, string.length - 1).toLowerCase();
        }
    };

    var isNode = typeof module == "object" && typeof require == "function";

    if (isNode) {
        try {
            buster = { format: require("buster-format") };
        } catch (e) {}
        module.exports = sinon;
        module.exports.spy = require("./sinon/spy");
        module.exports.stub = require("./sinon/stub");
        module.exports.mock = require("./sinon/mock");
        module.exports.collection = require("./sinon/collection");
        module.exports.assert = require("./sinon/assert");
        module.exports.sandbox = require("./sinon/sandbox");
        module.exports.test = require("./sinon/test");
        module.exports.testCase = require("./sinon/test_case");
        module.exports.assert = require("./sinon/assert");
        module.exports.match = require("./sinon/match");
    }

    if (buster) {
        var formatter = sinon.create(buster.format);
        formatter.quoteStrings = false;
        sinon.format = function () {
            return formatter.ascii.apply(formatter, arguments);
        };
    } else if (isNode) {
        try {
            var util = require("util");
            sinon.format = function (value) {
                return typeof value == "object" && value.toString === Object.prototype.toString ? util.inspect(value) : value;
            };
        } catch (e) {
            /* Node, but no util module - would be very old, but better safe than
             sorry */
        }
    }

    return sinon;
}(typeof buster == "object" && buster));

/* @depend ../sinon.js */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Match functions
 *
 * @author Maximilian Antoni (mail@maxantoni.de)
 * @license BSD
 *
 * Copyright (c) 2012 Maximilian Antoni
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function assertType(value, type, name) {
        var actual = sinon.typeOf(value);
        if (actual !== type) {
            throw new TypeError("Expected type of " + name + " to be " +
                type + ", but was " + actual);
        }
    }

    var matcher = {
        toString: function () {
            return this.message;
        }
    };

    function isMatcher(object) {
        return matcher.isPrototypeOf(object);
    }

    function matchObject(expectation, actual) {
        if (actual === null || actual === undefined) {
            return false;
        }
        for (var key in expectation) {
            if (expectation.hasOwnProperty(key)) {
                var exp = expectation[key];
                var act = actual[key];
                if (match.isMatcher(exp)) {
                    if (!exp.test(act)) {
                        return false;
                    }
                } else if (sinon.typeOf(exp) === "object") {
                    if (!matchObject(exp, act)) {
                        return false;
                    }
                } else if (!sinon.deepEqual(exp, act)) {
                    return false;
                }
            }
        }
        return true;
    }

    matcher.or = function (m2) {
        if (!isMatcher(m2)) {
            throw new TypeError("Matcher expected");
        }
        var m1 = this;
        var or = sinon.create(matcher);
        or.test = function (actual) {
            return m1.test(actual) || m2.test(actual);
        };
        or.message = m1.message + ".or(" + m2.message + ")";
        return or;
    };

    matcher.and = function (m2) {
        if (!isMatcher(m2)) {
            throw new TypeError("Matcher expected");
        }
        var m1 = this;
        var and = sinon.create(matcher);
        and.test = function (actual) {
            return m1.test(actual) && m2.test(actual);
        };
        and.message = m1.message + ".and(" + m2.message + ")";
        return and;
    };

    var match = function (expectation, message) {
        var m = sinon.create(matcher);
        var type = sinon.typeOf(expectation);
        switch (type) {
        case "object":
            if (typeof expectation.test === "function") {
                m.test = function (actual) {
                    return expectation.test(actual) === true;
                };
                m.message = "match(" + sinon.functionName(expectation.test) + ")";
                return m;
            }
            var str = [];
            for (var key in expectation) {
                if (expectation.hasOwnProperty(key)) {
                    str.push(key + ": " + expectation[key]);
                }
            }
            m.test = function (actual) {
                return matchObject(expectation, actual);
            };
            m.message = "match(" + str.join(", ") + ")";
            break;
        case "number":
            m.test = function (actual) {
                return expectation == actual;
            };
            break;
        case "string":
            m.test = function (actual) {
                if (typeof actual !== "string") {
                    return false;
                }
                return actual.indexOf(expectation) !== -1;
            };
            m.message = "match(\"" + expectation + "\")";
            break;
        case "regexp":
            m.test = function (actual) {
                if (typeof actual !== "string") {
                    return false;
                }
                return expectation.test(actual);
            };
            break;
        case "function":
            m.test = expectation;
            if (message) {
                m.message = message;
            } else {
                m.message = "match(" + sinon.functionName(expectation) + ")";
            }
            break;
        default:
            m.test = function (actual) {
              return sinon.deepEqual(expectation, actual);
            };
        }
        if (!m.message) {
            m.message = "match(" + expectation + ")";
        }
        return m;
    };

    match.isMatcher = isMatcher;

    match.any = match(function () {
        return true;
    }, "any");

    match.defined = match(function (actual) {
        return actual !== null && actual !== undefined;
    }, "defined");

    match.truthy = match(function (actual) {
        return !!actual;
    }, "truthy");

    match.falsy = match(function (actual) {
        return !actual;
    }, "falsy");

    match.same = function (expectation) {
        return match(function (actual) {
            return expectation === actual;
        }, "same(" + expectation + ")");
    };

    match.typeOf = function (type) {
        assertType(type, "string", "type");
        return match(function (actual) {
            return sinon.typeOf(actual) === type;
        }, "typeOf(\"" + type + "\")");
    };

    match.instanceOf = function (type) {
        assertType(type, "function", "type");
        return match(function (actual) {
            return actual instanceof type;
        }, "instanceOf(" + sinon.functionName(type) + ")");
    };

    function createPropertyMatcher(propertyTest, messagePrefix) {
        return function (property, value) {
            assertType(property, "string", "property");
            var onlyProperty = arguments.length === 1;
            var message = messagePrefix + "(\"" + property + "\"";
            if (!onlyProperty) {
                message += ", " + value;
            }
            message += ")";
            return match(function (actual) {
                if (actual === undefined || actual === null ||
                        !propertyTest(actual, property)) {
                    return false;
                }
                return onlyProperty || sinon.deepEqual(value, actual[property]);
            }, message);
        };
    }

    match.has = createPropertyMatcher(function (actual, property) {
        if (typeof actual === "object") {
            return property in actual;
        }
        return actual[property] !== undefined;
    }, "has");

    match.hasOwn = createPropertyMatcher(function (actual, property) {
        return actual.hasOwnProperty(property);
    }, "hasOwn");

    match.bool = match.typeOf("boolean");
    match.number = match.typeOf("number");
    match.string = match.typeOf("string");
    match.object = match.typeOf("object");
    match.func = match.typeOf("function");
    match.array = match.typeOf("array");
    match.regexp = match.typeOf("regexp");
    match.date = match.typeOf("date");

    if (commonJSModule) {
        module.exports = match;
    } else {
        sinon.match = match;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend match.js
 */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Spy functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";
    var spyCall;
    var callId = 0;
    var push = [].push;
    var slice = Array.prototype.slice;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function spy(object, property) {
        if (!property && typeof object == "function") {
            return spy.create(object);
        }

        if (!object && !property) {
            return spy.create(function () {});
        }

        var method = object[property];
        return sinon.wrapMethod(object, property, spy.create(method));
    }

    sinon.extend(spy, (function () {

        function delegateToCalls(api, method, matchAny, actual, notCalled) {
            api[method] = function () {
                if (!this.called) {
                    if (notCalled) {
                        return notCalled.apply(this, arguments);
                    }
                    return false;
                }

                var currentCall;
                var matches = 0;

                for (var i = 0, l = this.callCount; i < l; i += 1) {
                    currentCall = this.getCall(i);

                    if (currentCall[actual || method].apply(currentCall, arguments)) {
                        matches += 1;

                        if (matchAny) {
                            return true;
                        }
                    }
                }

                return matches === this.callCount;
            };
        }

        function matchingFake(fakes, args, strict) {
            if (!fakes) {
                return;
            }

            var alen = args.length;

            for (var i = 0, l = fakes.length; i < l; i++) {
                if (fakes[i].matches(args, strict)) {
                    return fakes[i];
                }
            }
        }

        function incrementCallCount() {
            this.called = true;
            this.callCount += 1;
            this.notCalled = false;
            this.calledOnce = this.callCount == 1;
            this.calledTwice = this.callCount == 2;
            this.calledThrice = this.callCount == 3;
        }

        function createCallProperties() {
            this.firstCall = this.getCall(0);
            this.secondCall = this.getCall(1);
            this.thirdCall = this.getCall(2);
            this.lastCall = this.getCall(this.callCount - 1);
        }

        var vars = "a,b,c,d,e,f,g,h,i,j,k,l";
        function createProxy(func) {
            // Retain the function length:
            if (func.length) {
                return eval("(function proxy(" + vars.substring(0, func.length * 2 - 1) +
                  ") { return proxy.invoke(func, this, slice.call(arguments)); })");
            }
            return function proxy() {
                return proxy.invoke(func, this, slice.call(arguments));
            };
        }

        var uuid = 0;

        // Public API
        var spyApi = {
            reset: function () {
                this.called = false;
                this.notCalled = true;
                this.calledOnce = false;
                this.calledTwice = false;
                this.calledThrice = false;
                this.callCount = 0;
                this.firstCall = null;
                this.secondCall = null;
                this.thirdCall = null;
                this.lastCall = null;
                this.args = [];
                this.returnValues = [];
                this.thisValues = [];
                this.exceptions = [];
                this.callIds = [];
                if (this.fakes) {
                    for (var i = 0; i < this.fakes.length; i++) {
                        this.fakes[i].reset();
                    }
                }
            },

            create: function create(func) {
                var name;

                if (typeof func != "function") {
                    func = function () {};
                } else {
                    name = sinon.functionName(func);
                }

                var proxy = createProxy(func);

                sinon.extend(proxy, spy);
                delete proxy.create;
                sinon.extend(proxy, func);

                proxy.reset();
                proxy.prototype = func.prototype;
                proxy.displayName = name || "spy";
                proxy.toString = sinon.functionToString;
                proxy._create = sinon.spy.create;
                proxy.id = "spy#" + uuid++;

                return proxy;
            },

            invoke: function invoke(func, thisValue, args) {
                var matching = matchingFake(this.fakes, args);
                var exception, returnValue;

                incrementCallCount.call(this);
                push.call(this.thisValues, thisValue);
                push.call(this.args, args);
                push.call(this.callIds, callId++);

                try {
                    if (matching) {
                        returnValue = matching.invoke(func, thisValue, args);
                    } else {
                        returnValue = (this.func || func).apply(thisValue, args);
                    }
                } catch (e) {
                    push.call(this.returnValues, undefined);
                    exception = e;
                    throw e;
                } finally {
                    push.call(this.exceptions, exception);
                }

                push.call(this.returnValues, returnValue);

                createCallProperties.call(this);

                return returnValue;
            },

            getCall: function getCall(i) {
                if (i < 0 || i >= this.callCount) {
                    return null;
                }

                return spyCall.create(this, this.thisValues[i], this.args[i],
                                      this.returnValues[i], this.exceptions[i],
                                      this.callIds[i]);
            },

            calledBefore: function calledBefore(spyFn) {
                if (!this.called) {
                    return false;
                }

                if (!spyFn.called) {
                    return true;
                }

                return this.callIds[0] < spyFn.callIds[spyFn.callIds.length - 1];
            },

            calledAfter: function calledAfter(spyFn) {
                if (!this.called || !spyFn.called) {
                    return false;
                }

                return this.callIds[this.callCount - 1] > spyFn.callIds[spyFn.callCount - 1];
            },

            withArgs: function () {
                var args = slice.call(arguments);

                if (this.fakes) {
                    var match = matchingFake(this.fakes, args, true);

                    if (match) {
                        return match;
                    }
                } else {
                    this.fakes = [];
                }

                var original = this;
                var fake = this._create();
                fake.matchingAguments = args;
                push.call(this.fakes, fake);

                fake.withArgs = function () {
                    return original.withArgs.apply(original, arguments);
                };

                for (var i = 0; i < this.args.length; i++) {
                    if (fake.matches(this.args[i])) {
                        incrementCallCount.call(fake);
                        push.call(fake.thisValues, this.thisValues[i]);
                        push.call(fake.args, this.args[i]);
                        push.call(fake.returnValues, this.returnValues[i]);
                        push.call(fake.exceptions, this.exceptions[i]);
                        push.call(fake.callIds, this.callIds[i]);
                    }
                }
                createCallProperties.call(fake);

                return fake;
            },

            matches: function (args, strict) {
                var margs = this.matchingAguments;

                if (margs.length <= args.length &&
                    sinon.deepEqual(margs, args.slice(0, margs.length))) {
                    return !strict || margs.length == args.length;
                }
            },

            printf: function (format) {
                var spy = this;
                var args = slice.call(arguments, 1);
                var formatter;

                return (format || "").replace(/%(.)/g, function (match, specifyer) {
                    formatter = spyApi.formatters[specifyer];

                    if (typeof formatter == "function") {
                        return formatter.call(null, spy, args);
                    } else if (!isNaN(parseInt(specifyer), 10)) {
                        return sinon.format(args[specifyer - 1]);
                    }

                    return "%" + specifyer;
                });
            }
        };

        delegateToCalls(spyApi, "calledOn", true);
        delegateToCalls(spyApi, "alwaysCalledOn", false, "calledOn");
        delegateToCalls(spyApi, "calledWith", true);
        delegateToCalls(spyApi, "calledWithMatch", true);
        delegateToCalls(spyApi, "alwaysCalledWith", false, "calledWith");
        delegateToCalls(spyApi, "alwaysCalledWithMatch", false, "calledWithMatch");
        delegateToCalls(spyApi, "calledWithExactly", true);
        delegateToCalls(spyApi, "alwaysCalledWithExactly", false, "calledWithExactly");
        delegateToCalls(spyApi, "neverCalledWith", false, "notCalledWith",
            function () { return true; });
        delegateToCalls(spyApi, "neverCalledWithMatch", false, "notCalledWithMatch",
            function () { return true; });
        delegateToCalls(spyApi, "threw", true);
        delegateToCalls(spyApi, "alwaysThrew", false, "threw");
        delegateToCalls(spyApi, "returned", true);
        delegateToCalls(spyApi, "alwaysReturned", false, "returned");
        delegateToCalls(spyApi, "calledWithNew", true);
        delegateToCalls(spyApi, "alwaysCalledWithNew", false, "calledWithNew");
        delegateToCalls(spyApi, "callArg", false, "callArgWith", function () {
            throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");
        });
        spyApi.callArgWith = spyApi.callArg;
        delegateToCalls(spyApi, "yield", false, "yield", function () {
            throw new Error(this.toString() + " cannot yield since it was not yet invoked.");
        });
        // "invokeCallback" is an alias for "yield" since "yield" is invalid in strict mode.
        spyApi.invokeCallback = spyApi.yield;
        delegateToCalls(spyApi, "yieldTo", false, "yieldTo", function (property) {
            throw new Error(this.toString() + " cannot yield to '" + property +
                "' since it was not yet invoked.");
        });

        spyApi.formatters = {
            "c": function (spy) {
                return sinon.timesInWords(spy.callCount);
            },

            "n": function (spy) {
                return spy.toString();
            },

            "C": function (spy) {
                var calls = [];

                for (var i = 0, l = spy.callCount; i < l; ++i) {
                    push.call(calls, "    " + spy.getCall(i).toString());
                }

                return calls.length > 0 ? "\n" + calls.join("\n") : "";
            },

            "t": function (spy) {
                var objects = [];

                for (var i = 0, l = spy.callCount; i < l; ++i) {
                    push.call(objects, sinon.format(spy.thisValues[i]));
                }

                return objects.join(", ");
            },

            "*": function (spy, args) {
                var formatted = [];

                for (var i = 0, l = args.length; i < l; ++i) {
                    push.call(formatted, sinon.format(args[i]));
                }

                return formatted.join(", ");
            }
        };

        return spyApi;
    }()));

    spyCall = (function () {

        function throwYieldError(proxy, text, args) {
            var msg = sinon.functionName(proxy) + text;
            if (args.length) {
                msg += " Received [" + slice.call(args).join(", ") + "]";
            }
            throw new Error(msg);
        }

        var callApi = {
            create: function create(spy, thisValue, args, returnValue, exception, id) {
                var proxyCall = sinon.create(spyCall);
                delete proxyCall.create;
                proxyCall.proxy = spy;
                proxyCall.thisValue = thisValue;
                proxyCall.args = args;
                proxyCall.returnValue = returnValue;
                proxyCall.exception = exception;
                proxyCall.callId = typeof id == "number" && id || callId++;

                return proxyCall;
            },

            calledOn: function calledOn(thisValue) {
                if (sinon.match && sinon.match.isMatcher(thisValue)) {
                    return thisValue.test(this.thisValue);
                }
                return this.thisValue === thisValue;
            },

            calledWith: function calledWith() {
                for (var i = 0, l = arguments.length; i < l; i += 1) {
                    if (!sinon.deepEqual(arguments[i], this.args[i])) {
                        return false;
                    }
                }

                return true;
            },

            calledWithMatch: function calledWithMatch() {
              for (var i = 0, l = arguments.length; i < l; i += 1) {
                  var actual = this.args[i];
                  var expectation = arguments[i];
                  if (!sinon.match || !sinon.match(expectation).test(actual)) {
                      return false;
                  }
              }
              return true;
            },

            calledWithExactly: function calledWithExactly() {
                return arguments.length == this.args.length &&
                    this.calledWith.apply(this, arguments);
            },

            notCalledWith: function notCalledWith() {
                return !this.calledWith.apply(this, arguments);
            },

            notCalledWithMatch: function notCalledWithMatch() {
              return !this.calledWithMatch.apply(this, arguments);
            },

            returned: function returned(value) {
                return sinon.deepEqual(value, this.returnValue);
            },

            threw: function threw(error) {
                if (typeof error == "undefined" || !this.exception) {
                    return !!this.exception;
                }

                if (typeof error == "string") {
                    return this.exception.name == error;
                }

                return this.exception === error;
            },

            calledWithNew: function calledWithNew(thisValue) {
                return this.thisValue instanceof this.proxy;
            },

            calledBefore: function (other) {
                return this.callId < other.callId;
            },

            calledAfter: function (other) {
                return this.callId > other.callId;
            },

            callArg: function (pos) {
                this.args[pos]();
            },

            callArgWith: function (pos) {
                var args = slice.call(arguments, 1);
                this.args[pos].apply(null, args);
            },

            "yield": function () {
                var args = this.args;
                for (var i = 0, l = args.length; i < l; ++i) {
                    if (typeof args[i] === "function") {
                        args[i].apply(null, slice.call(arguments));
                        return;
                    }
                }
                throwYieldError(this.proxy, " cannot yield since no callback was passed.", args);
            },

            yieldTo: function (prop) {
                var args = this.args;
                for (var i = 0, l = args.length; i < l; ++i) {
                    if (args[i] && typeof args[i][prop] === "function") {
                        args[i][prop].apply(null, slice.call(arguments, 1));
                        return;
                    }
                }
                throwYieldError(this.proxy, " cannot yield to '" + prop +
                    "' since no callback was passed.", args);
            },

            toString: function () {
                var callStr = this.proxy.toString() + "(";
                var args = [];

                for (var i = 0, l = this.args.length; i < l; ++i) {
                    push.call(args, sinon.format(this.args[i]));
                }

                callStr = callStr + args.join(", ") + ")";

                if (typeof this.returnValue != "undefined") {
                    callStr += " => " + sinon.format(this.returnValue);
                }

                if (this.exception) {
                    callStr += " !" + this.exception.name;

                    if (this.exception.message) {
                        callStr += "(" + this.exception.message + ")";
                    }
                }

                return callStr;
            }
        };
        callApi.invokeCallback = callApi.yield;
        return callApi;
    }());

    spy.spyCall = spyCall;

    // This steps outside the module sandbox and will be removed
    sinon.spyCall = spyCall;

    if (commonJSModule) {
        module.exports = spy;
    } else {
        sinon.spy = spy;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend spy.js
 */
/*jslint eqeqeq: false, onevar: false*/
/*global module, require, sinon*/
/**
 * Stub functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function stub(object, property, func) {
        if (!!func && typeof func != "function") {
            throw new TypeError("Custom stub should be function");
        }

        var wrapper;

        if (func) {
            wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;
        } else {
            wrapper = stub.create();
        }

        if (!object && !property) {
            return sinon.stub.create();
        }

        if (!property && !!object && typeof object == "object") {
            for (var prop in object) {
                if (typeof object[prop] === "function") {
                    stub(object, prop);
                }
            }

            return object;
        }

        return sinon.wrapMethod(object, property, wrapper);
    }

    function getChangingValue(stub, property) {
        var index = stub.callCount - 1;
        var prop = index in stub[property] ? stub[property][index] : stub[property + "Last"];
        stub[property + "Last"] = prop;

        return prop;
    }

    function getCallback(stub, args) {
        var callArgAt = getChangingValue(stub, "callArgAts");

        if (callArgAt < 0) {
            var callArgProp = getChangingValue(stub, "callArgProps");

            for (var i = 0, l = args.length; i < l; ++i) {
                if (!callArgProp && typeof args[i] == "function") {
                    return args[i];
                }

                if (callArgProp && args[i] &&
                    typeof args[i][callArgProp] == "function") {
                    return args[i][callArgProp];
                }
            }

            return null;
        }

        return args[callArgAt];
    }

    var join = Array.prototype.join;

    function getCallbackError(stub, func, args) {
        if (stub.callArgAtsLast < 0) {
            var msg;

            if (stub.callArgPropsLast) {
                msg = sinon.functionName(stub) +
                    " expected to yield to '" + stub.callArgPropsLast +
                    "', but no object with such a property was passed."
            } else {
                msg = sinon.functionName(stub) +
                            " expected to yield, but no callback was passed."
            }

            if (args.length > 0) {
                msg += " Received [" + join.call(args, ", ") + "]";
            }

            return msg;
        }

        return "argument at index " + stub.callArgAtsLast + " is not a function: " + func;
    }

    var nextTick = (function () {
        if (typeof process === "object" && typeof process.nextTick === "function") {
            return process.nextTick;
        } else if (typeof msSetImmediate === "function") {
            return msSetImmediate.bind(window);
        } else if (typeof setImmediate === "function") {
            return setImmediate;
        } else {
            return function (callback) {
                setTimeout(callback, 0);
            };
        }
    })();

    function callCallback(stub, args) {
        if (stub.callArgAts.length > 0) {
            var func = getCallback(stub, args);

            if (typeof func != "function") {
                throw new TypeError(getCallbackError(stub, func, args));
            }

            var index = stub.callCount - 1;

            var callbackArguments = getChangingValue(stub, "callbackArguments");
            var callbackContext = getChangingValue(stub, "callbackContexts");

            if (stub.callbackAsync) {
                nextTick(function() {
                    func.apply(callbackContext, callbackArguments);
                });
            } else {
                func.apply(callbackContext, callbackArguments);
            }
        }
    }

    var uuid = 0;

    sinon.extend(stub, (function () {
        var slice = Array.prototype.slice, proto;

        function throwsException(error, message) {
            if (typeof error == "string") {
                this.exception = new Error(message || "");
                this.exception.name = error;
            } else if (!error) {
                this.exception = new Error("Error");
            } else {
                this.exception = error;
            }

            return this;
        }

        proto = {
            create: function create() {
                var functionStub = function () {

                    callCallback(functionStub, arguments);

                    if (functionStub.exception) {
                        throw functionStub.exception;
                    } else if (typeof functionStub.returnArgAt == 'number') {
                        return arguments[functionStub.returnArgAt];
                    } else if (functionStub.returnThis) {
                        return this;
                    }
                    return functionStub.returnValue;
                };

                functionStub.id = "stub#" + uuid++;
                var orig = functionStub;
                functionStub = sinon.spy.create(functionStub);
                functionStub.func = orig;

                functionStub.callArgAts = [];
                functionStub.callbackArguments = [];
                functionStub.callbackContexts = [];
                functionStub.callArgProps = [];

                sinon.extend(functionStub, stub);
                functionStub._create = sinon.stub.create;
                functionStub.displayName = "stub";
                functionStub.toString = sinon.functionToString;

                return functionStub;
            },

            returns: function returns(value) {
                this.returnValue = value;

                return this;
            },

            returnsArg: function returnsArg(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.returnArgAt = pos;

                return this;
            },

            returnsThis: function returnsThis() {
                this.returnThis = true;

                return this;
            },

            "throws": throwsException,
            throwsException: throwsException,

            callsArg: function callsArg(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.callArgAts.push(pos);
                this.callbackArguments.push([]);
                this.callbackContexts.push(undefined);
                this.callArgProps.push(undefined);

                return this;
            },

            callsArgOn: function callsArgOn(pos, context) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAts.push(pos);
                this.callbackArguments.push([]);
                this.callbackContexts.push(context);
                this.callArgProps.push(undefined);

                return this;
            },

            callsArgWith: function callsArgWith(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.callArgAts.push(pos);
                this.callbackArguments.push(slice.call(arguments, 1));
                this.callbackContexts.push(undefined);
                this.callArgProps.push(undefined);

                return this;
            },

            callsArgOnWith: function callsArgWith(pos, context) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAts.push(pos);
                this.callbackArguments.push(slice.call(arguments, 2));
                this.callbackContexts.push(context);
                this.callArgProps.push(undefined);

                return this;
            },

            yields: function () {
                this.callArgAts.push(-1);
                this.callbackArguments.push(slice.call(arguments, 0));
                this.callbackContexts.push(undefined);
                this.callArgProps.push(undefined);

                return this;
            },

            yieldsOn: function (context) {
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAts.push(-1);
                this.callbackArguments.push(slice.call(arguments, 1));
                this.callbackContexts.push(context);
                this.callArgProps.push(undefined);

                return this;
            },

            yieldsTo: function (prop) {
                this.callArgAts.push(-1);
                this.callbackArguments.push(slice.call(arguments, 1));
                this.callbackContexts.push(undefined);
                this.callArgProps.push(prop);

                return this;
            },

            yieldsToOn: function (prop, context) {
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAts.push(-1);
                this.callbackArguments.push(slice.call(arguments, 2));
                this.callbackContexts.push(context);
                this.callArgProps.push(prop);

                return this;
            }
        };

        // create asynchronous versions of callsArg* and yields* methods
        for (var method in proto) {
            // need to avoid creating anotherasync versions of the newly added async methods
            if (proto.hasOwnProperty(method) &&
                method.match(/^(callsArg|yields|thenYields$)/) &&
                !method.match(/Async/)) {
                proto[method + 'Async'] = (function (syncFnName) {
                    return function () {
                        this.callbackAsync = true;
                        return this[syncFnName].apply(this, arguments);
                    };
                })(method);
            }
        }

        return proto;

    }()));

    if (commonJSModule) {
        module.exports = stub;
    } else {
        sinon.stub = stub;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend stub.js
 */
/*jslint eqeqeq: false, onevar: false, nomen: false*/
/*global module, require, sinon*/
/**
 * Mock functions.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";
    var push = [].push;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function mock(object) {
        if (!object) {
            return sinon.expectation.create("Anonymous mock");
        }

        return mock.create(object);
    }

    sinon.mock = mock;

    sinon.extend(mock, (function () {
        function each(collection, callback) {
            if (!collection) {
                return;
            }

            for (var i = 0, l = collection.length; i < l; i += 1) {
                callback(collection[i]);
            }
        }

        return {
            create: function create(object) {
                if (!object) {
                    throw new TypeError("object is null");
                }

                var mockObject = sinon.extend({}, mock);
                mockObject.object = object;
                delete mockObject.create;

                return mockObject;
            },

            expects: function expects(method) {
                if (!method) {
                    throw new TypeError("method is falsy");
                }

                if (!this.expectations) {
                    this.expectations = {};
                    this.proxies = [];
                }

                if (!this.expectations[method]) {
                    this.expectations[method] = [];
                    var mockObject = this;

                    sinon.wrapMethod(this.object, method, function () {
                        return mockObject.invokeMethod(method, this, arguments);
                    });

                    push.call(this.proxies, method);
                }

                var expectation = sinon.expectation.create(method);
                push.call(this.expectations[method], expectation);

                return expectation;
            },

            restore: function restore() {
                var object = this.object;

                each(this.proxies, function (proxy) {
                    if (typeof object[proxy].restore == "function") {
                        object[proxy].restore();
                    }
                });
            },

            verify: function verify() {
                var expectations = this.expectations || {};
                var messages = [], met = [];

                each(this.proxies, function (proxy) {
                    each(expectations[proxy], function (expectation) {
                        if (!expectation.met()) {
                            push.call(messages, expectation.toString());
                        } else {
                            push.call(met, expectation.toString());
                        }
                    });
                });

                this.restore();

                if (messages.length > 0) {
                    sinon.expectation.fail(messages.concat(met).join("\n"));
                } else {
                    sinon.expectation.pass(messages.concat(met).join("\n"));
                }

                return true;
            },

            invokeMethod: function invokeMethod(method, thisValue, args) {
                var expectations = this.expectations && this.expectations[method];
                var length = expectations && expectations.length || 0, i;

                for (i = 0; i < length; i += 1) {
                    if (!expectations[i].met() &&
                        expectations[i].allowsCall(thisValue, args)) {
                        return expectations[i].apply(thisValue, args);
                    }
                }

                var messages = [], available, exhausted = 0;

                for (i = 0; i < length; i += 1) {
                    if (expectations[i].allowsCall(thisValue, args)) {
                        available = available || expectations[i];
                    } else {
                        exhausted += 1;
                    }
                    push.call(messages, "    " + expectations[i].toString());
                }

                if (exhausted === 0) {
                    return available.apply(thisValue, args);
                }

                messages.unshift("Unexpected call: " + sinon.spyCall.toString.call({
                    proxy: method,
                    args: args
                }));

                sinon.expectation.fail(messages.join("\n"));
            }
        };
    }()));

    var times = sinon.timesInWords;

    sinon.expectation = (function () {
        var slice = Array.prototype.slice;
        var _invoke = sinon.spy.invoke;

        function callCountInWords(callCount) {
            if (callCount == 0) {
                return "never called";
            } else {
                return "called " + times(callCount);
            }
        }

        function expectedCallCountInWords(expectation) {
            var min = expectation.minCalls;
            var max = expectation.maxCalls;

            if (typeof min == "number" && typeof max == "number") {
                var str = times(min);

                if (min != max) {
                    str = "at least " + str + " and at most " + times(max);
                }

                return str;
            }

            if (typeof min == "number") {
                return "at least " + times(min);
            }

            return "at most " + times(max);
        }

        function receivedMinCalls(expectation) {
            var hasMinLimit = typeof expectation.minCalls == "number";
            return !hasMinLimit || expectation.callCount >= expectation.minCalls;
        }

        function receivedMaxCalls(expectation) {
            if (typeof expectation.maxCalls != "number") {
                return false;
            }

            return expectation.callCount == expectation.maxCalls;
        }

        return {
            minCalls: 1,
            maxCalls: 1,

            create: function create(methodName) {
                var expectation = sinon.extend(sinon.stub.create(), sinon.expectation);
                delete expectation.create;
                expectation.method = methodName;

                return expectation;
            },

            invoke: function invoke(func, thisValue, args) {
                this.verifyCallAllowed(thisValue, args);

                return _invoke.apply(this, arguments);
            },

            atLeast: function atLeast(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not number");
                }

                if (!this.limitsSet) {
                    this.maxCalls = null;
                    this.limitsSet = true;
                }

                this.minCalls = num;

                return this;
            },

            atMost: function atMost(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not number");
                }

                if (!this.limitsSet) {
                    this.minCalls = null;
                    this.limitsSet = true;
                }

                this.maxCalls = num;

                return this;
            },

            never: function never() {
                return this.exactly(0);
            },

            once: function once() {
                return this.exactly(1);
            },

            twice: function twice() {
                return this.exactly(2);
            },

            thrice: function thrice() {
                return this.exactly(3);
            },

            exactly: function exactly(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not a number");
                }

                this.atLeast(num);
                return this.atMost(num);
            },

            met: function met() {
                return !this.failed && receivedMinCalls(this);
            },

            verifyCallAllowed: function verifyCallAllowed(thisValue, args) {
                if (receivedMaxCalls(this)) {
                    this.failed = true;
                    sinon.expectation.fail(this.method + " already called " + times(this.maxCalls));
                }

                if ("expectedThis" in this && this.expectedThis !== thisValue) {
                    sinon.expectation.fail(this.method + " called with " + thisValue + " as thisValue, expected " +
                        this.expectedThis);
                }

                if (!("expectedArguments" in this)) {
                    return;
                }

                if (!args) {
                    sinon.expectation.fail(this.method + " received no arguments, expected " +
                        this.expectedArguments.join());
                }

                if (args.length < this.expectedArguments.length) {
                    sinon.expectation.fail(this.method + " received too few arguments (" + args.join() +
                        "), expected " + this.expectedArguments.join());
                }

                if (this.expectsExactArgCount &&
                    args.length != this.expectedArguments.length) {
                    sinon.expectation.fail(this.method + " received too many arguments (" + args.join() +
                        "), expected " + this.expectedArguments.join());
                }

                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {
                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
                        sinon.expectation.fail(this.method + " received wrong arguments (" + args.join() +
                            "), expected " + this.expectedArguments.join());
                    }
                }
            },

            allowsCall: function allowsCall(thisValue, args) {
                if (this.met() && receivedMaxCalls(this)) {
                    return false;
                }

                if ("expectedThis" in this && this.expectedThis !== thisValue) {
                    return false;
                }

                if (!("expectedArguments" in this)) {
                    return true;
                }

                args = args || [];

                if (args.length < this.expectedArguments.length) {
                    return false;
                }

                if (this.expectsExactArgCount &&
                    args.length != this.expectedArguments.length) {
                    return false;
                }

                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {
                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
                        return false;
                    }
                }

                return true;
            },

            withArgs: function withArgs() {
                this.expectedArguments = slice.call(arguments);
                return this;
            },

            withExactArgs: function withExactArgs() {
                this.withArgs.apply(this, arguments);
                this.expectsExactArgCount = true;
                return this;
            },

            on: function on(thisValue) {
                this.expectedThis = thisValue;
                return this;
            },

            toString: function () {
                var args = (this.expectedArguments || []).slice();

                if (!this.expectsExactArgCount) {
                    push.call(args, "[...]");
                }

                var callStr = sinon.spyCall.toString.call({
                    proxy: this.method, args: args
                });

                var message = callStr.replace(", [...", "[, ...") + " " +
                    expectedCallCountInWords(this);

                if (this.met()) {
                    return "Expectation met: " + message;
                }

                return "Expected " + message + " (" +
                    callCountInWords(this.callCount) + ")";
            },

            verify: function verify() {
                if (!this.met()) {
                    sinon.expectation.fail(this.toString());
                } else {
                    sinon.expectation.pass(this.toString());
                }

                return true;
            },

            pass: function(message) {
              sinon.assert.pass(message);
            },
            fail: function (message) {
                var exception = new Error(message);
                exception.name = "ExpectationError";

                throw exception;
            }
        };
    }());

    if (commonJSModule) {
        module.exports = mock;
    } else {
        sinon.mock = mock;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 */
/*jslint eqeqeq: false, onevar: false, forin: true*/
/*global module, require, sinon*/
/**
 * Collections of stubs, spies and mocks.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";
    var push = [].push;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function getFakes(fakeCollection) {
        if (!fakeCollection.fakes) {
            fakeCollection.fakes = [];
        }

        return fakeCollection.fakes;
    }

    function each(fakeCollection, method) {
        var fakes = getFakes(fakeCollection);

        for (var i = 0, l = fakes.length; i < l; i += 1) {
            if (typeof fakes[i][method] == "function") {
                fakes[i][method]();
            }
        }
    }

    function compact(fakeCollection) {
        var fakes = getFakes(fakeCollection);
        var i = 0;
        while (i < fakes.length) {
          fakes.splice(i, 1);
        }
    }

    var collection = {
        verify: function resolve() {
            each(this, "verify");
        },

        restore: function restore() {
            each(this, "restore");
            compact(this);
        },

        verifyAndRestore: function verifyAndRestore() {
            var exception;

            try {
                this.verify();
            } catch (e) {
                exception = e;
            }

            this.restore();

            if (exception) {
                throw exception;
            }
        },

        add: function add(fake) {
            push.call(getFakes(this), fake);
            return fake;
        },

        spy: function spy() {
            return this.add(sinon.spy.apply(sinon, arguments));
        },

        stub: function stub(object, property, value) {
            if (property) {
                var original = object[property];

                if (typeof original != "function") {
                    if (!hasOwnProperty.call(object, property)) {
                        throw new TypeError("Cannot stub non-existent own property " + property);
                    }

                    object[property] = value;

                    return this.add({
                        restore: function () {
                            object[property] = original;
                        }
                    });
                }
            }
            if (!property && !!object && typeof object == "object") {
                var stubbedObj = sinon.stub.apply(sinon, arguments);

                for (var prop in stubbedObj) {
                    if (typeof stubbedObj[prop] === "function") {
                        this.add(stubbedObj[prop]);
                    }
                }

                return stubbedObj;
            }

            return this.add(sinon.stub.apply(sinon, arguments));
        },

        mock: function mock() {
            return this.add(sinon.mock.apply(sinon, arguments));
        },

        inject: function inject(obj) {
            var col = this;

            obj.spy = function () {
                return col.spy.apply(col, arguments);
            };

            obj.stub = function () {
                return col.stub.apply(col, arguments);
            };

            obj.mock = function () {
                return col.mock.apply(col, arguments);
            };

            return obj;
        }
    };

    if (commonJSModule) {
        module.exports = collection;
    } else {
        sinon.collection = collection;
    }
}(typeof sinon == "object" && sinon || null));

/*jslint eqeqeq: false, plusplus: false, evil: true, onevar: false, browser: true, forin: false*/
/*global module, require, window*/
/**
 * Fake timer API
 * setTimeout
 * setInterval
 * clearTimeout
 * clearInterval
 * tick
 * reset
 * Date
 *
 * Inspired by jsUnitMockTimeOut from JsUnit
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

if (typeof sinon == "undefined") {
    var sinon = {};
}

(function (global) {
    var id = 1;

    function addTimer(args, recurring) {
        if (args.length === 0) {
            throw new Error("Function requires at least 1 parameter");
        }

        var toId = id++;
        var delay = args[1] || 0;

        if (!this.timeouts) {
            this.timeouts = {};
        }

        this.timeouts[toId] = {
            id: toId,
            func: args[0],
            callAt: this.now + delay,
            invokeArgs: Array.prototype.slice.call(args, 2)
        };

        if (recurring === true) {
            this.timeouts[toId].interval = delay;
        }

        return toId;
    }

    function parseTime(str) {
        if (!str) {
            return 0;
        }

        var strings = str.split(":");
        var l = strings.length, i = l;
        var ms = 0, parsed;

        if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
            throw new Error("tick only understands numbers and 'h:m:s'");
        }

        while (i--) {
            parsed = parseInt(strings[i], 10);

            if (parsed >= 60) {
                throw new Error("Invalid time " + str);
            }

            ms += parsed * Math.pow(60, (l - i - 1));
        }

        return ms * 1000;
    }

    function createObject(object) {
        var newObject;

        if (Object.create) {
            newObject = Object.create(object);
        } else {
            var F = function () {};
            F.prototype = object;
            newObject = new F();
        }

        newObject.Date.clock = newObject;
        return newObject;
    }

    sinon.clock = {
        now: 0,

        create: function create(now) {
            var clock = createObject(this);

            if (typeof now == "number") {
                clock.now = now;
            }

            if (!!now && typeof now == "object") {
                throw new TypeError("now should be milliseconds since UNIX epoch");
            }

            return clock;
        },

        setTimeout: function setTimeout(callback, timeout) {
            return addTimer.call(this, arguments, false);
        },

        clearTimeout: function clearTimeout(timerId) {
            if (!this.timeouts) {
                this.timeouts = [];
            }

            if (timerId in this.timeouts) {
                delete this.timeouts[timerId];
            }
        },

        setInterval: function setInterval(callback, timeout) {
            return addTimer.call(this, arguments, true);
        },

        clearInterval: function clearInterval(timerId) {
            this.clearTimeout(timerId);
        },

        tick: function tick(ms) {
            ms = typeof ms == "number" ? ms : parseTime(ms);
            var tickFrom = this.now, tickTo = this.now + ms, previous = this.now;
            var timer = this.firstTimerInRange(tickFrom, tickTo);

            var firstException;
            while (timer && tickFrom <= tickTo) {
                if (this.timeouts[timer.id]) {
                    tickFrom = this.now = timer.callAt;
                    try {
                      this.callTimer(timer);
                    } catch (e) {
                      firstException = firstException || e;
                    }
                }

                timer = this.firstTimerInRange(previous, tickTo);
                previous = tickFrom;
            }

            this.now = tickTo;

            if (firstException) {
              throw firstException;
            }
        },

        firstTimerInRange: function (from, to) {
            var timer, smallest, originalTimer;

            for (var id in this.timeouts) {
                if (this.timeouts.hasOwnProperty(id)) {
                    if (this.timeouts[id].callAt < from || this.timeouts[id].callAt > to) {
                        continue;
                    }

                    if (!smallest || this.timeouts[id].callAt < smallest) {
                        originalTimer = this.timeouts[id];
                        smallest = this.timeouts[id].callAt;

                        timer = {
                            func: this.timeouts[id].func,
                            callAt: this.timeouts[id].callAt,
                            interval: this.timeouts[id].interval,
                            id: this.timeouts[id].id,
                            invokeArgs: this.timeouts[id].invokeArgs
                        };
                    }
                }
            }

            return timer || null;
        },

        callTimer: function (timer) {
            if (typeof timer.interval == "number") {
                this.timeouts[timer.id].callAt += timer.interval;
            } else {
                delete this.timeouts[timer.id];
            }

            try {
                if (typeof timer.func == "function") {
                    timer.func.apply(null, timer.invokeArgs);
                } else {
                    eval(timer.func);
                }
            } catch (e) {
              var exception = e;
            }

            if (!this.timeouts[timer.id]) {
                if (exception) {
                  throw exception;
                }
                return;
            }

            if (exception) {
              throw exception;
            }
        },

        reset: function reset() {
            this.timeouts = {};
        },

        Date: (function () {
            var NativeDate = Date;

            function ClockDate(year, month, date, hour, minute, second, ms) {
                // Defensive and verbose to avoid potential harm in passing
                // explicit undefined when user does not pass argument
                switch (arguments.length) {
                case 0:
                    return new NativeDate(ClockDate.clock.now);
                case 1:
                    return new NativeDate(year);
                case 2:
                    return new NativeDate(year, month);
                case 3:
                    return new NativeDate(year, month, date);
                case 4:
                    return new NativeDate(year, month, date, hour);
                case 5:
                    return new NativeDate(year, month, date, hour, minute);
                case 6:
                    return new NativeDate(year, month, date, hour, minute, second);
                default:
                    return new NativeDate(year, month, date, hour, minute, second, ms);
                }
            }

            return mirrorDateProperties(ClockDate, NativeDate);
        }())
    };

    function mirrorDateProperties(target, source) {
        if (source.now) {
            target.now = function now() {
                return target.clock.now;
            };
        } else {
            delete target.now;
        }

        if (source.toSource) {
            target.toSource = function toSource() {
                return source.toSource();
            };
        } else {
            delete target.toSource;
        }

        target.toString = function toString() {
            return source.toString();
        };

        target.prototype = source.prototype;
        target.parse = source.parse;
        target.UTC = source.UTC;
        target.prototype.toUTCString = source.prototype.toUTCString;
        return target;
    }

    var methods = ["Date", "setTimeout", "setInterval",
                   "clearTimeout", "clearInterval"];

    function restore() {
        var method;

        for (var i = 0, l = this.methods.length; i < l; i++) {
            method = this.methods[i];
            if (global[method].hadOwnProperty) {
                global[method] = this["_" + method];
            } else {
                delete global[method];
            }
        }

        // Prevent multiple executions which will completely remove these props
        this.methods = [];
    }

    function stubGlobal(method, clock) {
        clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(global, method);
        clock["_" + method] = global[method];

        if (method == "Date") {
            var date = mirrorDateProperties(clock[method], global[method]);
            global[method] = date;
        } else {
            global[method] = function () {
                return clock[method].apply(clock, arguments);
            };

            for (var prop in clock[method]) {
                if (clock[method].hasOwnProperty(prop)) {
                    global[method][prop] = clock[method][prop];
                }
            }
        }

        global[method].clock = clock;
    }

    sinon.useFakeTimers = function useFakeTimers(now) {
        var clock = sinon.clock.create(now);
        clock.restore = restore;
        clock.methods = Array.prototype.slice.call(arguments,
                                                   typeof now == "number" ? 1 : 0);

        if (clock.methods.length === 0) {
            clock.methods = methods;
        }

        for (var i = 0, l = clock.methods.length; i < l; i++) {
            stubGlobal(clock.methods[i], clock);
        }

        return clock;
    };
}(typeof global != "undefined" && typeof global !== "function" ? global : this));

sinon.timers = {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    Date: Date
};

if (typeof module == "object" && typeof require == "function") {
    module.exports = sinon;
}

/*jslint eqeqeq: false, onevar: false*/
/*global sinon, module, require, ActiveXObject, XMLHttpRequest, DOMParser*/
/**
 * Minimal Event interface implementation
 *
 * Original implementation by Sven Fuchs: https://gist.github.com/995028
 * Modifications and tests by Christian Johansen.
 *
 * @author Sven Fuchs (svenfuchs@artweb-design.de)
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2011 Sven Fuchs, Christian Johansen
 */

if (typeof sinon == "undefined") {
    this.sinon = {};
}

(function () {
    var push = [].push;

    sinon.Event = function Event(type, bubbles, cancelable) {
        this.initEvent(type, bubbles, cancelable);
    };

    sinon.Event.prototype = {
        initEvent: function(type, bubbles, cancelable) {
            this.type = type;
            this.bubbles = bubbles;
            this.cancelable = cancelable;
        },

        stopPropagation: function () {},

        preventDefault: function () {
            this.defaultPrevented = true;
        }
    };

    sinon.EventTarget = {
        addEventListener: function addEventListener(event, listener, useCapture) {
            this.eventListeners = this.eventListeners || {};
            this.eventListeners[event] = this.eventListeners[event] || [];
            push.call(this.eventListeners[event], listener);
        },

        removeEventListener: function removeEventListener(event, listener, useCapture) {
            var listeners = this.eventListeners && this.eventListeners[event] || [];

            for (var i = 0, l = listeners.length; i < l; ++i) {
                if (listeners[i] == listener) {
                    return listeners.splice(i, 1);
                }
            }
        },

        dispatchEvent: function dispatchEvent(event) {
            var type = event.type;
            var listeners = this.eventListeners && this.eventListeners[type] || [];

            for (var i = 0; i < listeners.length; i++) {
                if (typeof listeners[i] == "function") {
                    listeners[i].call(this, event);
                } else {
                    listeners[i].handleEvent(event);
                }
            }

            return !!event.defaultPrevented;
        }
    };
}());

/**
 * @depend ../../sinon.js
 * @depend event.js
 */
/*jslint eqeqeq: false, onevar: false*/
/*global sinon, module, require, ActiveXObject, XMLHttpRequest, DOMParser*/
/**
 * Fake XMLHttpRequest object
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

if (typeof sinon == "undefined") {
    this.sinon = {};
}
sinon.xhr = { XMLHttpRequest: this.XMLHttpRequest };

// wrapper for global
(function(global) {
    var xhr = sinon.xhr;
    xhr.GlobalXMLHttpRequest = global.XMLHttpRequest;
    xhr.GlobalActiveXObject = global.ActiveXObject;
    xhr.supportsActiveX = typeof xhr.GlobalActiveXObject != "undefined";
    xhr.supportsXHR = typeof xhr.GlobalXMLHttpRequest != "undefined";
    xhr.workingXHR = xhr.supportsXHR ? xhr.GlobalXMLHttpRequest : xhr.supportsActiveX
                                     ? function() { return new xhr.GlobalActiveXObject("MSXML2.XMLHTTP.3.0") } : false;

    /*jsl:ignore*/
    var unsafeHeaders = {
        "Accept-Charset": true,
        "Accept-Encoding": true,
        "Connection": true,
        "Content-Length": true,
        "Cookie": true,
        "Cookie2": true,
        "Content-Transfer-Encoding": true,
        "Date": true,
        "Expect": true,
        "Host": true,
        "Keep-Alive": true,
        "Referer": true,
        "TE": true,
        "Trailer": true,
        "Transfer-Encoding": true,
        "Upgrade": true,
        "User-Agent": true,
        "Via": true
    };
    /*jsl:end*/

    function FakeXMLHttpRequest() {
        this.readyState = FakeXMLHttpRequest.UNSENT;
        this.requestHeaders = {};
        this.requestBody = null;
        this.status = 0;
        this.statusText = "";

        if (typeof FakeXMLHttpRequest.onCreate == "function") {
            FakeXMLHttpRequest.onCreate(this);
        }
    }

    function verifyState(xhr) {
        if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {
            throw new Error("INVALID_STATE_ERR");
        }

        if (xhr.sendFlag) {
            throw new Error("INVALID_STATE_ERR");
        }
    }

    // filtering to enable a white-list version of Sinon FakeXhr,
    // where whitelisted requests are passed through to real XHR
    function each(collection, callback) {
        if (!collection) return;
        for (var i = 0, l = collection.length; i < l; i += 1) {
            callback(collection[i]);
        }
    }
    function some(collection, callback) {
        for (var index = 0; index < collection.length; index++) {
            if(callback(collection[index]) === true) return true;
        };
        return false;
    }
    // largest arity in XHR is 5 - XHR#open
    var apply = function(obj,method,args) {
        switch(args.length) {
        case 0: return obj[method]();
        case 1: return obj[method](args[0]);
        case 2: return obj[method](args[0],args[1]);
        case 3: return obj[method](args[0],args[1],args[2]);
        case 4: return obj[method](args[0],args[1],args[2],args[3]);
        case 5: return obj[method](args[0],args[1],args[2],args[3],args[4]);
        };
    };

    FakeXMLHttpRequest.filters = [];
    FakeXMLHttpRequest.addFilter = function(fn) {
        this.filters.push(fn)
    };
    var IE6Re = /MSIE 6/;
    FakeXMLHttpRequest.defake = function(fakeXhr,xhrArgs) {
        var xhr = new sinon.xhr.workingXHR();
        each(["open","setRequestHeader","send","abort","getResponseHeader",
              "getAllResponseHeaders","addEventListener","overrideMimeType","removeEventListener"],
             function(method) {
                 fakeXhr[method] = function() {
                   return apply(xhr,method,arguments);
                 };
             });

        var copyAttrs = function(args) {
            each(args, function(attr) {
              try {
                fakeXhr[attr] = xhr[attr]
              } catch(e) {
                if(!IE6Re.test(navigator.userAgent)) throw e;
              }
            });
        };

        var stateChange = function() {
            fakeXhr.readyState = xhr.readyState;
            if(xhr.readyState >= FakeXMLHttpRequest.HEADERS_RECEIVED) {
                copyAttrs(["status","statusText"]);
            }
            if(xhr.readyState >= FakeXMLHttpRequest.LOADING) {
                copyAttrs(["responseText"]);
            }
            if(xhr.readyState === FakeXMLHttpRequest.DONE) {
                copyAttrs(["responseXML"]);
            }
            if(fakeXhr.onreadystatechange) fakeXhr.onreadystatechange.call(fakeXhr);
        };
        if(xhr.addEventListener) {
          for(var event in fakeXhr.eventListeners) {
              if(fakeXhr.eventListeners.hasOwnProperty(event)) {
                  each(fakeXhr.eventListeners[event],function(handler) {
                      xhr.addEventListener(event, handler);
                  });
              }
          }
          xhr.addEventListener("readystatechange",stateChange);
        } else {
          xhr.onreadystatechange = stateChange;
        }
        apply(xhr,"open",xhrArgs);
    };
    FakeXMLHttpRequest.useFilters = false;

    function verifyRequestSent(xhr) {
        if (xhr.readyState == FakeXMLHttpRequest.DONE) {
            throw new Error("Request done");
        }
    }

    function verifyHeadersReceived(xhr) {
        if (xhr.async && xhr.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {
            throw new Error("No headers received");
        }
    }

    function verifyResponseBodyType(body) {
        if (typeof body != "string") {
            var error = new Error("Attempted to respond to fake XMLHttpRequest with " +
                                 body + ", which is not a string.");
            error.name = "InvalidBodyException";
            throw error;
        }
    }

    sinon.extend(FakeXMLHttpRequest.prototype, sinon.EventTarget, {
        async: true,

        open: function open(method, url, async, username, password) {
            this.method = method;
            this.url = url;
            this.async = typeof async == "boolean" ? async : true;
            this.username = username;
            this.password = password;
            this.responseText = null;
            this.responseXML = null;
            this.requestHeaders = {};
            this.sendFlag = false;
            if(sinon.FakeXMLHttpRequest.useFilters === true) {
                var xhrArgs = arguments;
                var defake = some(FakeXMLHttpRequest.filters,function(filter) {
                    return filter.apply(this,xhrArgs)
                });
                if (defake) {
                  return sinon.FakeXMLHttpRequest.defake(this,arguments);
                }
            }
            this.readyStateChange(FakeXMLHttpRequest.OPENED);
        },

        readyStateChange: function readyStateChange(state) {
            this.readyState = state;

            if (typeof this.onreadystatechange == "function") {
                try {
                    this.onreadystatechange();
                } catch (e) {
                    sinon.logError("Fake XHR onreadystatechange handler", e);
                }
            }

            this.dispatchEvent(new sinon.Event("readystatechange"));
        },

        setRequestHeader: function setRequestHeader(header, value) {
            verifyState(this);

            if (unsafeHeaders[header] || /^(Sec-|Proxy-)/.test(header)) {
                throw new Error("Refused to set unsafe header \"" + header + "\"");
            }

            if (this.requestHeaders[header]) {
                this.requestHeaders[header] += "," + value;
            } else {
                this.requestHeaders[header] = value;
            }
        },

        // Helps testing
        setResponseHeaders: function setResponseHeaders(headers) {
            this.responseHeaders = {};

            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    this.responseHeaders[header] = headers[header];
                }
            }

            if (this.async) {
                this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);
            }
        },

        // Currently treats ALL data as a DOMString (i.e. no Document)
        send: function send(data) {
            verifyState(this);

            if (!/^(get|head)$/i.test(this.method)) {
                if (this.requestHeaders["Content-Type"]) {
                    var value = this.requestHeaders["Content-Type"].split(";");
                    this.requestHeaders["Content-Type"] = value[0] + ";charset=utf-8";
                } else {
                    this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";
                }

                this.requestBody = data;
            }

            this.errorFlag = false;
            this.sendFlag = this.async;
            this.readyStateChange(FakeXMLHttpRequest.OPENED);

            if (typeof this.onSend == "function") {
                this.onSend(this);
            }
        },

        abort: function abort() {
            this.aborted = true;
            this.responseText = null;
            this.errorFlag = true;
            this.requestHeaders = {};

            if (this.readyState > sinon.FakeXMLHttpRequest.UNSENT && this.sendFlag) {
                this.readyStateChange(sinon.FakeXMLHttpRequest.DONE);
                this.sendFlag = false;
            }

            this.readyState = sinon.FakeXMLHttpRequest.UNSENT;
        },

        getResponseHeader: function getResponseHeader(header) {
            if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
                return null;
            }

            if (/^Set-Cookie2?$/i.test(header)) {
                return null;
            }

            header = header.toLowerCase();

            for (var h in this.responseHeaders) {
                if (h.toLowerCase() == header) {
                    return this.responseHeaders[h];
                }
            }

            return null;
        },

        getAllResponseHeaders: function getAllResponseHeaders() {
            if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
                return "";
            }

            var headers = "";

            for (var header in this.responseHeaders) {
                if (this.responseHeaders.hasOwnProperty(header) &&
                    !/^Set-Cookie2?$/i.test(header)) {
                    headers += header + ": " + this.responseHeaders[header] + "\r\n";
                }
            }

            return headers;
        },

        setResponseBody: function setResponseBody(body) {
            verifyRequestSent(this);
            verifyHeadersReceived(this);
            verifyResponseBodyType(body);

            var chunkSize = this.chunkSize || 10;
            var index = 0;
            this.responseText = "";

            do {
                if (this.async) {
                    this.readyStateChange(FakeXMLHttpRequest.LOADING);
                }

                this.responseText += body.substring(index, index + chunkSize);
                index += chunkSize;
            } while (index < body.length);

            var type = this.getResponseHeader("Content-Type");

            if (this.responseText &&
                (!type || /(text\/xml)|(application\/xml)|(\+xml)/.test(type))) {
                try {
                    this.responseXML = FakeXMLHttpRequest.parseXML(this.responseText);
                } catch (e) {
                    // Unable to parse XML - no biggie
                }
            }

            if (this.async) {
                this.readyStateChange(FakeXMLHttpRequest.DONE);
            } else {
                this.readyState = FakeXMLHttpRequest.DONE;
            }
        },

        respond: function respond(status, headers, body) {
            this.setResponseHeaders(headers || {});
            this.status = typeof status == "number" ? status : 200;
            this.statusText = FakeXMLHttpRequest.statusCodes[this.status];
            this.setResponseBody(body || "");
        }
    });

    sinon.extend(FakeXMLHttpRequest, {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    });

    // Borrowed from JSpec
    FakeXMLHttpRequest.parseXML = function parseXML(text) {
        var xmlDoc;

        if (typeof DOMParser != "undefined") {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(text, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(text);
        }

        return xmlDoc;
    };

    FakeXMLHttpRequest.statusCodes = {
        100: "Continue",
        101: "Switching Protocols",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        300: "Multiple Choice",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Long",
        415: "Unsupported Media Type",
        416: "Requested Range Not Satisfiable",
        417: "Expectation Failed",
        422: "Unprocessable Entity",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported"
    };

    sinon.useFakeXMLHttpRequest = function () {
        sinon.FakeXMLHttpRequest.restore = function restore(keepOnCreate) {
            if (xhr.supportsXHR) {
                global.XMLHttpRequest = xhr.GlobalXMLHttpRequest;
            }

            if (xhr.supportsActiveX) {
                global.ActiveXObject = xhr.GlobalActiveXObject;
            }

            delete sinon.FakeXMLHttpRequest.restore;

            if (keepOnCreate !== true) {
                delete sinon.FakeXMLHttpRequest.onCreate;
            }
        };
        if (xhr.supportsXHR) {
            global.XMLHttpRequest = sinon.FakeXMLHttpRequest;
        }

        if (xhr.supportsActiveX) {
            global.ActiveXObject = function ActiveXObject(objId) {
                if (objId == "Microsoft.XMLHTTP" || /^Msxml2\.XMLHTTP/i.test(objId)) {

                    return new sinon.FakeXMLHttpRequest();
                }

                return new xhr.GlobalActiveXObject(objId);
            };
        }

        return sinon.FakeXMLHttpRequest;
    };

    sinon.FakeXMLHttpRequest = FakeXMLHttpRequest;
})(this);

if (typeof module == "object" && typeof require == "function") {
    module.exports = sinon;
}

/**
 * @depend fake_xml_http_request.js
 */
/*jslint eqeqeq: false, onevar: false, regexp: false, plusplus: false*/
/*global module, require, window*/
/**
 * The Sinon "server" mimics a web server that receives requests from
 * sinon.FakeXMLHttpRequest and provides an API to respond to those requests,
 * both synchronously and asynchronously. To respond synchronuously, canned
 * answers have to be provided upfront.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

if (typeof sinon == "undefined") {
    var sinon = {};
}

sinon.fakeServer = (function () {
    var push = [].push;
    function F() {}

    function create(proto) {
        F.prototype = proto;
        return new F();
    }

    function responseArray(handler) {
        var response = handler;

        if (Object.prototype.toString.call(handler) != "[object Array]") {
            response = [200, {}, handler];
        }

        if (typeof response[2] != "string") {
            throw new TypeError("Fake server response body should be string, but was " +
                                typeof response[2]);
        }

        return response;
    }

    var wloc = typeof window !== "undefined" ? window.location : {};
    var rCurrLoc = new RegExp("^" + wloc.protocol + "//" + wloc.host);

    function matchOne(response, reqMethod, reqUrl) {
        var rmeth = response.method;
        var matchMethod = !rmeth || rmeth.toLowerCase() == reqMethod.toLowerCase();
        var url = response.url;
        var matchUrl = !url || url == reqUrl || (typeof url.test == "function" && url.test(reqUrl));

        return matchMethod && matchUrl;
    }

    function match(response, request) {
        var requestMethod = this.getHTTPMethod(request);
        var requestUrl = request.url;

        if (!/^https?:\/\//.test(requestUrl) || rCurrLoc.test(requestUrl)) {
            requestUrl = requestUrl.replace(rCurrLoc, "");
        }

        if (matchOne(response, this.getHTTPMethod(request), requestUrl)) {
            if (typeof response.response == "function") {
                var ru = response.url;
                var args = [request].concat(!ru ? [] : requestUrl.match(ru).slice(1));
                return response.response.apply(response, args);
            }

            return true;
        }

        return false;
    }

    return {
        create: function () {
            var server = create(this);
            this.xhr = sinon.useFakeXMLHttpRequest();
            server.requests = [];

            this.xhr.onCreate = function (xhrObj) {
                server.addRequest(xhrObj);
            };

            return server;
        },

        addRequest: function addRequest(xhrObj) {
            var server = this;
            push.call(this.requests, xhrObj);

            xhrObj.onSend = function () {
                server.handleRequest(this);
            };

            if (this.autoRespond && !this.responding) {
                setTimeout(function () {
                    server.responding = false;
                    server.respond();
                }, this.autoRespondAfter || 10);

                this.responding = true;
            }
        },

        getHTTPMethod: function getHTTPMethod(request) {
            if (this.fakeHTTPMethods && /post/i.test(request.method)) {
                var matches = (request.requestBody || "").match(/_method=([^\b;]+)/);
                return !!matches ? matches[1] : request.method;
            }

            return request.method;
        },

        handleRequest: function handleRequest(xhr) {
            if (xhr.async) {
                if (!this.queue) {
                    this.queue = [];
                }

                push.call(this.queue, xhr);
            } else {
                this.processRequest(xhr);
            }
        },

        respondWith: function respondWith(method, url, body) {
            if (arguments.length == 1 && typeof method != "function") {
                this.response = responseArray(method);
                return;
            }

            if (!this.responses) { this.responses = []; }

            if (arguments.length == 1) {
                body = method;
                url = method = null;
            }

            if (arguments.length == 2) {
                body = url;
                url = method;
                method = null;
            }

            push.call(this.responses, {
                method: method,
                url: url,
                response: typeof body == "function" ? body : responseArray(body)
            });
        },

        respond: function respond() {
            if (arguments.length > 0) this.respondWith.apply(this, arguments);
            var queue = this.queue || [];
            var request;

            while(request = queue.shift()) {
                this.processRequest(request);
            }
        },

        processRequest: function processRequest(request) {
            try {
                if (request.aborted) {
                    return;
                }

                var response = this.response || [404, {}, ""];

                if (this.responses) {
                    for (var i = 0, l = this.responses.length; i < l; i++) {
                        if (match.call(this, this.responses[i], request)) {
                            response = this.responses[i].response;
                            break;
                        }
                    }
                }

                if (request.readyState != 4) {
                    request.respond(response[0], response[1], response[2]);
                }
            } catch (e) {
                sinon.logError("Fake server request processing", e);
            }
        },

        restore: function restore() {
            return this.xhr.restore && this.xhr.restore.apply(this.xhr, arguments);
        }
    };
}());

if (typeof module == "object" && typeof require == "function") {
    module.exports = sinon;
}

/**
 * @depend fake_server.js
 * @depend fake_timers.js
 */
/*jslint browser: true, eqeqeq: false, onevar: false*/
/*global sinon*/
/**
 * Add-on for sinon.fakeServer that automatically handles a fake timer along with
 * the FakeXMLHttpRequest. The direct inspiration for this add-on is jQuery
 * 1.3.x, which does not use xhr object's onreadystatehandler at all - instead,
 * it polls the object for completion with setInterval. Dispite the direct
 * motivation, there is nothing jQuery-specific in this file, so it can be used
 * in any environment where the ajax implementation depends on setInterval or
 * setTimeout.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function () {
    function Server() {}
    Server.prototype = sinon.fakeServer;

    sinon.fakeServerWithClock = new Server();

    sinon.fakeServerWithClock.addRequest = function addRequest(xhr) {
        if (xhr.async) {
            if (typeof setTimeout.clock == "object") {
                this.clock = setTimeout.clock;
            } else {
                this.clock = sinon.useFakeTimers();
                this.resetClock = true;
            }

            if (!this.longestTimeout) {
                var clockSetTimeout = this.clock.setTimeout;
                var clockSetInterval = this.clock.setInterval;
                var server = this;

                this.clock.setTimeout = function (fn, timeout) {
                    server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

                    return clockSetTimeout.apply(this, arguments);
                };

                this.clock.setInterval = function (fn, timeout) {
                    server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

                    return clockSetInterval.apply(this, arguments);
                };
            }
        }

        return sinon.fakeServer.addRequest.call(this, xhr);
    };

    sinon.fakeServerWithClock.respond = function respond() {
        var returnVal = sinon.fakeServer.respond.apply(this, arguments);

        if (this.clock) {
            this.clock.tick(this.longestTimeout || 0);
            this.longestTimeout = 0;

            if (this.resetClock) {
                this.clock.restore();
                this.resetClock = false;
            }
        }

        return returnVal;
    };

    sinon.fakeServerWithClock.restore = function restore() {
        if (this.clock) {
            this.clock.restore();
        }

        return sinon.fakeServer.restore.apply(this, arguments);
    };
}());

/**
 * @depend ../sinon.js
 * @depend collection.js
 * @depend util/fake_timers.js
 * @depend util/fake_server_with_clock.js
 */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global require, module*/
/**
 * Manages fake collections as well as fake utilities such as Sinon's
 * timers and fake XHR implementation in one convenient object.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

if (typeof module == "object" && typeof require == "function") {
    var sinon = require("../sinon");
    sinon.extend(sinon, require("./util/fake_timers"));
}

(function () {
    var push = [].push;

    function exposeValue(sandbox, config, key, value) {
        if (!value) {
            return;
        }

        if (config.injectInto) {
            config.injectInto[key] = value;
        } else {
            push.call(sandbox.args, value);
        }
    }

    function prepareSandboxFromConfig(config) {
        var sandbox = sinon.create(sinon.sandbox);

        if (config.useFakeServer) {
            if (typeof config.useFakeServer == "object") {
                sandbox.serverPrototype = config.useFakeServer;
            }

            sandbox.useFakeServer();
        }

        if (config.useFakeTimers) {
            if (typeof config.useFakeTimers == "object") {
                sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);
            } else {
                sandbox.useFakeTimers();
            }
        }

        return sandbox;
    }

    sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {
        useFakeTimers: function useFakeTimers() {
            this.clock = sinon.useFakeTimers.apply(sinon, arguments);

            return this.add(this.clock);
        },

        serverPrototype: sinon.fakeServer,

        useFakeServer: function useFakeServer() {
            var proto = this.serverPrototype || sinon.fakeServer;

            if (!proto || !proto.create) {
                return null;
            }

            this.server = proto.create();
            return this.add(this.server);
        },

        inject: function (obj) {
            sinon.collection.inject.call(this, obj);

            if (this.clock) {
                obj.clock = this.clock;
            }

            if (this.server) {
                obj.server = this.server;
                obj.requests = this.server.requests;
            }

            return obj;
        },

        create: function (config) {
            if (!config) {
                return sinon.create(sinon.sandbox);
            }

            var sandbox = prepareSandboxFromConfig(config);
            sandbox.args = sandbox.args || [];
            var prop, value, exposed = sandbox.inject({});

            if (config.properties) {
                for (var i = 0, l = config.properties.length; i < l; i++) {
                    prop = config.properties[i];
                    value = exposed[prop] || prop == "sandbox" && sandbox;
                    exposeValue(sandbox, config, prop, value);
                }
            } else {
                exposeValue(sandbox, config, "sandbox", value);
            }

            return sandbox;
        }
    });

    sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;

    if (typeof module == "object" && typeof require == "function") {
        module.exports = sinon.sandbox;
    }
}());

/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 * @depend sandbox.js
 */
/*jslint eqeqeq: false, onevar: false, forin: true, plusplus: false*/
/*global module, require, sinon*/
/**
 * Test function, sandboxes fakes
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function test(callback) {
        var type = typeof callback;

        if (type != "function") {
            throw new TypeError("sinon.test needs to wrap a test function, got " + type);
        }

        return function () {
            var config = sinon.getConfig(sinon.config);
            config.injectInto = config.injectIntoThis && this || config.injectInto;
            var sandbox = sinon.sandbox.create(config);
            var exception, result;
            var args = Array.prototype.slice.call(arguments).concat(sandbox.args);

            try {
                result = callback.apply(this, args);
            } catch (e) {
                exception = e;
            }

            if (typeof exception !== "undefined") {
                sandbox.restore();
                throw exception;
            }
            else {
                sandbox.verifyAndRestore();
            }

            return result;
        };
    }

    test.config = {
        injectIntoThis: true,
        injectInto: null,
        properties: ["spy", "stub", "mock", "clock", "server", "requests"],
        useFakeTimers: true,
        useFakeServer: true
    };

    if (commonJSModule) {
        module.exports = test;
    } else {
        sinon.test = test;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend test.js
 */
/*jslint eqeqeq: false, onevar: false, eqeqeq: false*/
/*global module, require, sinon*/
/**
 * Test case, sandboxes all test functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon || !Object.prototype.hasOwnProperty) {
        return;
    }

    function createTest(property, setUp, tearDown) {
        return function () {
            if (setUp) {
                setUp.apply(this, arguments);
            }

            var exception, result;

            try {
                result = property.apply(this, arguments);
            } catch (e) {
                exception = e;
            }

            if (tearDown) {
                tearDown.apply(this, arguments);
            }

            if (exception) {
                throw exception;
            }

            return result;
        };
    }

    function testCase(tests, prefix) {
        /*jsl:ignore*/
        if (!tests || typeof tests != "object") {
            throw new TypeError("sinon.testCase needs an object with test functions");
        }
        /*jsl:end*/

        prefix = prefix || "test";
        var rPrefix = new RegExp("^" + prefix);
        var methods = {}, testName, property, method;
        var setUp = tests.setUp;
        var tearDown = tests.tearDown;

        for (testName in tests) {
            if (tests.hasOwnProperty(testName)) {
                property = tests[testName];

                if (/^(setUp|tearDown)$/.test(testName)) {
                    continue;
                }

                if (typeof property == "function" && rPrefix.test(testName)) {
                    method = property;

                    if (setUp || tearDown) {
                        method = createTest(property, setUp, tearDown);
                    }

                    methods[testName] = sinon.test(method);
                } else {
                    methods[testName] = tests[testName];
                }
            }
        }

        return methods;
    }

    if (commonJSModule) {
        module.exports = testCase;
    } else {
        sinon.testCase = testCase;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend stub.js
 */
/*jslint eqeqeq: false, onevar: false, nomen: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Assertions matching the test spy retrieval interface.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon, global) {
    var commonJSModule = typeof module == "object" && typeof require == "function";
    var slice = Array.prototype.slice;
    var assert;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function verifyIsStub() {
        var method;

        for (var i = 0, l = arguments.length; i < l; ++i) {
            method = arguments[i];

            if (!method) {
                assert.fail("fake is not a spy");
            }

            if (typeof method != "function") {
                assert.fail(method + " is not a function");
            }

            if (typeof method.getCall != "function") {
                assert.fail(method + " is not stubbed");
            }
        }
    }

    function failAssertion(object, msg) {
        object = object || global;
        var failMethod = object.fail || assert.fail;
        failMethod.call(object, msg);
    }

    function mirrorPropAsAssertion(name, method, message) {
        if (arguments.length == 2) {
            message = method;
            method = name;
        }

        assert[name] = function (fake) {
            verifyIsStub(fake);

            var args = slice.call(arguments, 1);
            var failed = false;

            if (typeof method == "function") {
                failed = !method(fake);
            } else {
                failed = typeof fake[method] == "function" ?
                    !fake[method].apply(fake, args) : !fake[method];
            }

            if (failed) {
                failAssertion(this, fake.printf.apply(fake, [message].concat(args)));
            } else {
                assert.pass(name);
            }
        };
    }

    function exposedName(prefix, prop) {
        return !prefix || /^fail/.test(prop) ? prop :
            prefix + prop.slice(0, 1).toUpperCase() + prop.slice(1);
    };

    assert = {
        failException: "AssertError",

        fail: function fail(message) {
            var error = new Error(message);
            error.name = this.failException || assert.failException;

            throw error;
        },

        pass: function pass(assertion) {},

        callOrder: function assertCallOrder() {
            verifyIsStub.apply(null, arguments);
            var expected = "", actual = "";

            if (!sinon.calledInOrder(arguments)) {
                try {
                    expected = [].join.call(arguments, ", ");
                    actual = sinon.orderByFirstCall(slice.call(arguments)).join(", ");
                } catch (e) {
                    // If this fails, we'll just fall back to the blank string
                }

                failAssertion(this, "expected " + expected + " to be " +
                              "called in order but were called as " + actual);
            } else {
                assert.pass("callOrder");
            }
        },

        callCount: function assertCallCount(method, count) {
            verifyIsStub(method);

            if (method.callCount != count) {
                var msg = "expected %n to be called " + sinon.timesInWords(count) +
                    " but was called %c%C";
                failAssertion(this, method.printf(msg));
            } else {
                assert.pass("callCount");
            }
        },

        expose: function expose(target, options) {
            if (!target) {
                throw new TypeError("target is null or undefined");
            }

            var o = options || {};
            var prefix = typeof o.prefix == "undefined" && "assert" || o.prefix;
            var includeFail = typeof o.includeFail == "undefined" || !!o.includeFail;

            for (var method in this) {
                if (method != "export" && (includeFail || !/^(fail)/.test(method))) {
                    target[exposedName(prefix, method)] = this[method];
                }
            }

            return target;
        }
    };

    mirrorPropAsAssertion("called", "expected %n to have been called at least once but was never called");
    mirrorPropAsAssertion("notCalled", function (spy) { return !spy.called; },
                          "expected %n to not have been called but was called %c%C");
    mirrorPropAsAssertion("calledOnce", "expected %n to be called once but was called %c%C");
    mirrorPropAsAssertion("calledTwice", "expected %n to be called twice but was called %c%C");
    mirrorPropAsAssertion("calledThrice", "expected %n to be called thrice but was called %c%C");
    mirrorPropAsAssertion("calledOn", "expected %n to be called with %1 as this but was called with %t");
    mirrorPropAsAssertion("alwaysCalledOn", "expected %n to always be called with %1 as this but was called with %t");
    mirrorPropAsAssertion("calledWithNew", "expected %n to be called with new");
    mirrorPropAsAssertion("alwaysCalledWithNew", "expected %n to always be called with new");
    mirrorPropAsAssertion("calledWith", "expected %n to be called with arguments %*%C");
    mirrorPropAsAssertion("calledWithMatch", "expected %n to be called with match %*%C");
    mirrorPropAsAssertion("alwaysCalledWith", "expected %n to always be called with arguments %*%C");
    mirrorPropAsAssertion("alwaysCalledWithMatch", "expected %n to always be called with match %*%C");
    mirrorPropAsAssertion("calledWithExactly", "expected %n to be called with exact arguments %*%C");
    mirrorPropAsAssertion("alwaysCalledWithExactly", "expected %n to always be called with exact arguments %*%C");
    mirrorPropAsAssertion("neverCalledWith", "expected %n to never be called with arguments %*%C");
    mirrorPropAsAssertion("neverCalledWithMatch", "expected %n to never be called with match %*%C");
    mirrorPropAsAssertion("threw", "%n did not throw exception%C");
    mirrorPropAsAssertion("alwaysThrew", "%n did not always throw exception%C");

    if (commonJSModule) {
        module.exports = assert;
    } else {
        sinon.assert = assert;
    }
}(typeof sinon == "object" && sinon || null, typeof window != "undefined" ? window : global));

return sinon;}.call(typeof window != 'undefined' && window || {}));



define("sinon", function(){ return window.sinon; });

/**
 * Patterns logging - minimal logging framework
 *
 * Copyright 2012 Simplon B.V.
 */

(function() {
    // source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP &&
                            oThis ? this : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    var root,    // root logger instance
        writer;  // writer instance, used to output log entries

    var Level = {
        DEBUG: 10,
        INFO: 20,
        WARN: 30,
        ERROR: 40,
        FATAL: 50
    };

    function IEConsoleWriter() {
    }

    IEConsoleWriter.prototype = {
        output:  function(log_name, level, messages) {
            // console.log will magically appear in IE8 when the user opens the
            // F12 Developer Tools, so we have to test for it every time.
            if (typeof window.console==="undefined" || typeof console.log==="undefined")
                    return;
            if (log_name)
                messages.unshift(log_name+":");
            var message = messages.join(" ");

            // Under some conditions console.log will be available but the
            // other functions are missing.
            if (typeof console.info===undefined) {
                var level_name;
                if (level<=Level.DEBUG)
                    level_name="DEBUG";
                else if (level<=Level.INFO)
                    level_name="INFO";
                else if (level<=Level.WARN)
                    level_name="WARN";
                else if (level<=Level.ERROR)
                    level_name="ERROR";
                else
                    level_name="FATAL";
                console.log("["+level_name+"] "+message);
            } else {
                if (level<=Level.DEBUG) {
                    // console.debug exists but is deprecated
                    message="[DEBUG] "+message;
                    console.log(message);
                } else if (level<=Level.INFO)
                    console.info(message);
                else if (level<=Level.WARN)
                    console.warn(message);
                else
                    console.error(message);
            }
        }
    };


    function ConsoleWriter() {
    }

    ConsoleWriter.prototype = {
        output: function(log_name, level, messages) {
            if (log_name)
                messages.unshift(log_name+":");
            if (level<=Level.DEBUG) {
                // console.debug exists but is deprecated
                messages.unshift("[DEBUG]");
                console.log.apply(console, messages);
            } else if (level<=Level.INFO)
                console.info.apply(console, messages);
            else if (level<=Level.WARN)
                console.warn.apply(console, messages);
            else
                console.error.apply(console, messages);
        }
    };


    function Logger(name, parent) {
        this._loggers={};
        this.name=name || "";
        this._parent=parent || null;
        if (!parent) {
            this._enabled=true;
            this._level=Level.WARN;
        }
    }

    Logger.prototype = {
        getLogger: function(name) {
            var path = name.split("."),
                root = this,
                route = this.name ? [this.name] : [];
            while (path.length) {
                var entry = path.shift();
                route.push(entry);
                if (!(entry in root._loggers))
                    root._loggers[entry] = new Logger(route.join("."), root);
                root=root._loggers[entry];
            }
            return root;
        },

        _getFlag: function(flag) {
            var context=this;
            flag="_"+flag;
            while (context!==null) {
                if (context[flag]!==undefined)
                    return context[flag];
                context=context._parent;
            }
            return null;
        },

        setEnabled: function(state) {
            this._enabled=!!state;
        },

        isEnabled: function() {
            this._getFlag("enabled");
        },

        setLevel: function(level) {
            if (typeof level==="number")
                this._level=level;
            else if (typeof level==="string") {
                level=level.toUpperCase();
                if (level in Level)
                    this._level=Level[level];
            }
        },

        getLevel: function() {
            return this._getFlag("level");
        },

        log: function(level, messages) {
            if (!messages.length || !this._getFlag("enabled") || level<this._getFlag("level"))
                return;
            messages=Array.prototype.slice.call(messages);
            writer.output(this.name, level, messages);
        },

        debug: function() {
            this.log(Level.DEBUG, arguments);
        },

        info: function() {
            this.log(Level.INFO, arguments);
        },

        warn: function() {
            this.log(Level.WARN, arguments);
        },

        error: function() {
            this.log(Level.ERROR, arguments);
        },

        fatal: function() {
            this.log(Level.FATAL, arguments);
        }
    };

    function getWriter() {
        return writer;
    }

    function setWriter(w) {
        writer=w;
    }

    if (window.console && window.console.log && window.console.log.apply!==undefined)
        setWriter(new ConsoleWriter());
    else
        setWriter(new IEConsoleWriter());

    root=new Logger();

    var logconfig = /loglevel(|-[^=]+)=([^&]+)/g,
        match;

    while ((match=logconfig.exec(window.location.search))!==null) {
        var logger = (match[1]==="") ? root : root.getLogger(match[1].slice(1));
        logger.setLevel(match[2].toUpperCase());
    }

    var api = {
        Level: Level,
        getLogger: root.getLogger.bind(root),
        setEnabled: root.setEnabled.bind(root),
        isEnabled: root.isEnabled.bind(root),
        setLevel: root.setLevel.bind(root),
        getLevel: root.getLevel.bind(root),
        debug: root.debug.bind(root),
        info: root.info.bind(root),
        warn: root.warn.bind(root),
        error: root.error.bind(root),
        fatal: root.fatal.bind(root),
        getWriter: getWriter,
        setWriter: setWriter
    };

    // Expose as either an AMD module if possible. If not fall back to exposing
    // a global object.
    if (typeof define==="function")
        define("logging", [], function () {
            return api;
        });
    else
        window.logging=api;
})();

define("logging/src/logging", function(){});

/**
 * Patterns logger - wrapper around logging library
 *
 * Copyright 2012-2013 Florian Friesdorf
 */
define('jam/Patterns/src/core/logger',[
    'logging'
], function(logging) {
    var log = logging.getLogger('patterns');
    return log;
});

define('jam/Patterns/src/utils',[
    "jquery"
], function($) {
    var jquery_plugin = function(pattern) {
        var plugin = function(method) {
            var $this = this;
            if ($this.length === 0)
                return $this;
            if (!method || typeof method === "object") {
                pattern.init.apply(
                    $this,
                    [$this].concat(Array.prototype.slice.call(arguments)));
            } else if (pattern[method]) {
                return pattern[method].apply(
                    $this,
                    [$this].concat(Array.prototype.slice.call(arguments, 1))
                );
            } else {
                $.error("Method " + method +
                        " does not exist on jQuery." + pattern.name);
            }
            return $this;
        };
        return plugin;
    };

    //     Underscore.js 1.3.1
    //     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
    //     Underscore is freely distributable under the MIT license.
    //     Portions of Underscore are inspired or borrowed from Prototype,
    //     Oliver Steele's Functional, and John Resig's Micro-Templating.
    //     For all details and documentation:
    //     http://documentcloud.github.com/underscore
    //
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds.
    var debounce = function(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    var rebaseURL = function(base, url) {
        if (url.indexOf("://")!==-1 || url[0]==="/")
            return url;
        return base.slice(0, base.lastIndexOf("/")+1) + url;
    };

    function findLabel(input) {
        for (var label=input.parentNode; label && label.nodeType!==11; label=label.parentNode)
            if (label.tagName==="LABEL")
                return label;

        var $label;

        if (input.id)
            $label = $("label[for="+input.id+"]");
        if ($label && $label.length===0 && input.form)
            $label = $("label[for="+input.name+"]", input.form);
        if ($label && $label.length)
            return $label[0];
        else
            return null;
    }

    // Taken from http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    function elementInViewport(el) {
       var rect = el.getBoundingClientRect(),
           docEl = document.documentElement,
           vWidth = window.innerWidth || docEl.clientWidth,
           vHeight = window.innerHeight || docEl.clientHeight;

        if (rect.right<0 || rect.bottom<0 || rect.left>vWidth || rect.top>vHeight)
            return false;
        return true;
    }


    // Taken from http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    var utils = {
        // pattern pimping - own module?
        jquery_plugin: jquery_plugin,
        debounce: debounce,
        escapeRegExp: escapeRegExp,
        rebaseURL: rebaseURL,
        findLabel: findLabel,
        elementInViewport: elementInViewport
    };

    return utils;
});

/**
 * @license
 * Patterns @VERSION@ jquery-ext - various jQuery extensions
 *
 * Copyright 2011 Humberto Sermeño
 */
define('jam/Patterns/src/jquery-ext',["jquery"], function($) {
    var methods = {
        init: function( options ) {
            var settings = {
                time: 3, /* time it will wait before moving to "timeout" after a move event */
                initialTime: 8, /* time it will wait before first adding the "timeout" class */
                exceptionAreas: [] /* IDs of elements that, if the mouse is over them, will reset the timer */
            };
            return this.each(function() {
                var $this = $(this),
                    data = $this.data("timeout");

                if (!data) {
                    if ( options ) {
                        $.extend( settings, options );
                    }
                    $this.data("timeout", {
                        "lastEvent": new Date(),
                        "trueTime": settings.time,
                        "time": settings.initialTime,
                        "untouched": true,
                        "inExceptionArea": false
                    });

                    $this.bind( "mouseover.timeout", methods.mouseMoved );
                    $this.bind( "mouseenter.timeout", methods.mouseMoved );

                    $(settings.exceptionAreas).each(function() {
                        $this.find(this)
                            .live( "mouseover.timeout", {"parent":$this}, methods.enteredException )
                            .live( "mouseleave.timeout", {"parent":$this}, methods.leftException );
                    });

                    if (settings.initialTime > 0)
                        $this.timeout("startTimer");
                    else
                        $this.addClass("timeout");
                }
            });
        },

        enteredException: function(event) {
            var data = event.data.parent.data("timeout");
            data.inExceptionArea = true;
            event.data.parent.data("timeout", data);
            event.data.parent.trigger("mouseover");
        },

        leftException: function(event) {
            var data = event.data.parent.data("timeout");
            data.inExceptionArea = false;
            event.data.parent.data("timeout", data);
        },

        destroy: function() {
            return this.each( function() {
                var $this = $(this),
                    data = $this.data("timeout");

                $(window).unbind(".timeout");
                data.timeout.remove();
                $this.removeData("timeout");
            });
        },

        mouseMoved: function() {
            var $this = $(this), data = $this.data("timeout");

            if ($this.hasClass("timeout")) {
                $this.removeClass("timeout");
                $this.timeout("startTimer");
            } else if ( data.untouched ) {
                data.untouched = false;
                data.time = data.trueTime;
            }

            data.lastEvent = new Date();
            $this.data("timeout", data);
        },

        startTimer: function() {
            var $this = $(this), data = $this.data("timeout");
            var fn = function(){
                var data = $this.data("timeout");
                if ( data && data.lastEvent ) {
                    if ( data.inExceptionArea ) {
                        setTimeout( fn, Math.floor( data.time*1000 ) );
                    } else {
                        var now = new Date();
                        var diff = Math.floor(data.time*1000) - ( now - data.lastEvent );
                        if ( diff > 0 ) {
                            // the timeout has not ocurred, so set the timeout again
                            setTimeout( fn, diff+100 );
                        } else {
                            // timeout ocurred, so set the class
                            $this.addClass("timeout");
                        }
                    }
                }
            };

            setTimeout( fn, Math.floor( data.time*1000 ) );
        }
    };

    $.fn.timeout = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === "object" || !method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( "Method " + method + " does not exist on jQuery.timeout" );
        }
    };

    // Custom jQuery selector to find elements with scrollbars
    $.extend($.expr[":"], {
        scrollable: function(element) {
            var vertically_scrollable, horizontally_scrollable;
            if ($(element).css("overflow") === "scroll" ||
                $(element).css("overflowX") === "scroll" ||
                $(element).css("overflowY") === "scroll")
                return true;

            vertically_scrollable = (element.clientHeight < element.scrollHeight) && (
                $.inArray($(element).css("overflowY"), ["scroll", "auto"]) !== -1 || $.inArray($(element).css("overflow"), ["scroll", "auto"]) !== -1);

            if (vertically_scrollable)
                return true;

            horizontally_scrollable = (element.clientWidth < element.scrollWidth) && (
                $.inArray($(element).css("overflowX"), ["scroll", "auto"]) !== -1 || $.inArray($(element).css("overflow"), ["scroll", "auto"]) !== -1);
            return horizontally_scrollable;
        }
    });

    // Make Visible in scroll
    $.fn.makeVisibleInScroll = function( parent_id ) {
        var absoluteParent = null;
        if ( typeof parent_id === "string" ) {
            absoluteParent = $("#" + parent_id);
        } else if ( parent_id ) {
            absoluteParent = $(parent_id);
        }

        return this.each(function() {
            var $this = $(this), parent;
            if (!absoluteParent) {
                parent = $this.parents(":scrollable");
                if (parent.length > 0) {
                    parent = $(parent[0]);
                } else {
                    parent = $(window);
                }
            } else {
                parent = absoluteParent;
            }

            var elemTop = $this.position().top;
            var elemBottom = $this.height() + elemTop;

            var viewTop = parent.scrollTop();
            var viewBottom = parent.height() + viewTop;

            if (elemTop < viewTop) {
                parent.scrollTop(elemTop);
            } else if ( elemBottom > viewBottom - parent.height()/2 ) {
                parent.scrollTop( elemTop - (parent.height() - $this.height())/2 );
            }
        });
    };

    //Make absolute location
    $.fn.setPositionAbsolute = function(element,offsettop,offsetleft) {
        return this.each(function() {
            // set absolute location for based on the element passed
            // dynamically since every browser has different settings
            var $this = $(this);
            var thiswidth = $(this).width();
            var    pos   = element.offset();
            var    width = element.width();
            var    height = element.height();
            var setleft = (pos.left + width - thiswidth + offsetleft);
            var settop = (pos.top + height + offsettop);
            $this.css({ "z-index" : 1, "position": "absolute", "marginLeft": 0, "marginTop": 0, "left": setleft + "px", "top":settop + "px" ,"width":thiswidth});
            $this.remove().appendTo("body").show();
        });
    };

    $.fn.positionAncestor = function(selector) {
        var left = 0;
        var top = 0;
        this.each(function() {
            // check if current element has an ancestor matching a selector
            // and that ancestor is positioned
            var $ancestor = $(this).closest(selector);
            if ($ancestor.length && $ancestor.css("position") !== "static") {
                var $child = $(this);
                var childMarginEdgeLeft = $child.offset().left - parseInt($child.css("marginLeft"), 10);
                var childMarginEdgeTop = $child.offset().top - parseInt($child.css("marginTop"), 10);
                var ancestorPaddingEdgeLeft = $ancestor.offset().left + parseInt($ancestor.css("borderLeftWidth"), 10);
                var ancestorPaddingEdgeTop = $ancestor.offset().top + parseInt($ancestor.css("borderTopWidth"), 10);
                left = childMarginEdgeLeft - ancestorPaddingEdgeLeft;
                top = childMarginEdgeTop - ancestorPaddingEdgeTop;
                // we have found the ancestor and computed the position
                // stop iterating
                return false;
            }
        });
        return {
            left:    left,
            top:    top
        };
    };


    // XXX: In compat.js we include things for browser compatibility,
    // but these two seem to be only convenience. Do we really want to
    // include these as part of patterns?
    String.prototype.startsWith = function(str) { return (this.match("^"+str) !== null); };
    String.prototype.endsWith = function(str) { return (this.match(str+"$") !== null); };


    /******************************

     Simple Placeholder

     ******************************/

    $.simplePlaceholder = {
        placeholder_class: null,

        hide_placeholder: function(){
            var $this = $(this);
            if($this.val() === $this.attr("placeholder")){
                $this.val("").removeClass($.simplePlaceholder.placeholder_class);
            }
        },

        show_placeholder: function(){
            var $this = $(this);
            if($this.val() === ""){
                $this.val($this.attr("placeholder")).addClass($.simplePlaceholder.placeholder_class);
            }
        },

        prevent_placeholder_submit: function(){
            $(this).find(".simple-placeholder").each(function() {
                var $this = $(this);
                if ($this.val() === $this.attr("placeholder")){
                    $this.val("");
                }
            });
            return true;
        }
    };

    $.fn.simplePlaceholder = function(options) {
        if(document.createElement("input").placeholder === undefined){
            var config = {
                placeholder_class : "placeholding"
            };

            if(options) $.extend(config, options);
            $.simplePlaceholder.placeholder_class = config.placeholder_class;

            this.each(function() {
                var $this = $(this);
                $this.focus($.simplePlaceholder.hide_placeholder);
                $this.blur($.simplePlaceholder.show_placeholder);
                if($this.val() === "") {
                    $this.val($this.attr("placeholder"));
                    $this.addClass($.simplePlaceholder.placeholder_class);
                }
                $this.addClass("simple-placeholder");
                $(this.form).submit($.simplePlaceholder.prevent_placeholder_submit);
            });
        }

        return this;
    };

    $.fn.findInclusive = function(selector) {
        return this.find('*').addBack().filter(selector);
    };

    // case-insensitive :contains
    $.expr[":"].Contains = function(a, i, m) {
        return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };
});

define('jam/Patterns/src/compat',[],function() {

    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every (JS 1.6)
    if (!Array.prototype.every)
    {
        Array.prototype.every = function(fun /*, thisp */)
        {
            

            if (this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
                throw new TypeError();

            var thisp = arguments[1];
            for (var i = 0; i < len; i++)
            {
                if (i in t && !fun.call(thisp, t[i], i, t))
                    return false;
            }

            return true;
        };
    }


    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter (JS 1.6)
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(fun /*, thisp */) {
            

            if (this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
                throw new TypeError();

            var res = [];
            var thisp = arguments[1];
            for (var i = 0; i < len; i++)
            {
                if (i in t)
                {
                    var val = t[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, t))
                        res.push(val);
                }
            }

            return res;
        };
    }


    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach (JS 1.6)
    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.com/#x15.4.4.18
    if ( !Array.prototype.forEach ) {

        Array.prototype.forEach = function( callback, thisArg ) {

            var T, k;

            if ( this === null ) {
                throw new TypeError( " this is null or not defined" );
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0; // Hack to convert O.length to a UInt32

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if ( {}.toString.call(callback) !== "[object Function]" ) {
                throw new TypeError( callback + " is not a function" );
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if ( thisArg ) {
                T = thisArg;
            }

            // 6. Let k be 0
            k = 0;

            // 7. Repeat, while k < len
            while( k < len ) {

                var kValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if ( k in O ) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[ k ];

                    // ii. Call the Call internal method of callback with T as the this value and
                    // argument list containing kValue, k, and O.
                    callback.call( T, kValue, k, O );
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined
        };
    }


    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf (JS 1.6)
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
            
            if (this === null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (n !== n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }


    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf (JS 1.6)
    if (!Array.prototype.lastIndexOf) {
        Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
            

            if (this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0)
                return -1;

            var n = len;
            if (arguments.length > 1)
            {
                n = Number(arguments[1]);
                if (n !== n)
                    n = 0;
                else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }

            var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);

            for (; k >= 0; k--)
            {
                if (k in t && t[k] === searchElement)
                    return k;
            }
            return -1;
        };
    }


    // source: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map (JS 1.6)
    // Production steps of ECMA-262, Edition 5, 15.4.4.19
    // Reference: http://es5.github.com/#x15.4.4.19
    if (!Array.prototype.map) {
        Array.prototype.map = function(callback, thisArg) {

            var T, A, k;

            if (this === null) {
                throw new TypeError(" this is null or not defined");
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if ({}.toString.call(callback) !== "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (thisArg) {
                T = thisArg;
            }

            // 6. Let A be a new array created as if by the expression new Array(len) where Array is
            // the standard built-in constructor with that name and len is the value of len.
            A = new Array(len);

            // 7. Let k be 0
            k = 0;

            // 8. Repeat, while k < len
            while(k < len) {

                var kValue, mappedValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[ k ];

                    // ii. Let mappedValue be the result of calling the Call internal method of callback
                    // with T as the this value and argument list containing kValue, k, and O.
                    mappedValue = callback.call(T, kValue, k, O);

                    // iii. Call the DefineOwnProperty internal method of A with arguments
                    // Pk, Property Descriptor {Value: mappedValue, Writable: true, Enumerable: true, Configurable: true},
                    // and false.

                    // In browsers that support Object.defineProperty, use the following:
                    // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                    // For best browser support, use the following:
                    A[ k ] = mappedValue;
                }
                // d. Increase k by 1.
                k++;
            }

            // 9. return A
            return A;
        };
    }


    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce (JS 1.8)
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function reduce(accumulator){
            if (this===null || this===undefined) throw new TypeError("Object is null or undefined");
            var i = 0, l = this.length >> 0, curr;

            if(typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
                throw new TypeError("First argument is not callable");

            if(arguments.length < 2) {
                if (l === 0) throw new TypeError("Array length is 0 and no second argument");
                curr = this[0];
                i = 1; // start accumulating at the second element
            }
            else
                curr = arguments[1];

            while (i < l) {
                if(i in this) curr = accumulator.call(undefined, curr, this[i], i, this);
                ++i;
            }

            return curr;
        };
    }


    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/ReduceRight (JS 1.8)
    if (!Array.prototype.reduceRight)
    {
        Array.prototype.reduceRight = function(callbackfn /*, initialValue */)
        {
            

            if (this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof callbackfn !== "function")
                throw new TypeError();

            // no value to return if no initial value, empty array
            if (len === 0 && arguments.length === 1)
                throw new TypeError();

            var k = len - 1;
            var accumulator;
            if (arguments.length >= 2)
            {
                accumulator = arguments[1];
            }
            else
            {
                do
                {
                    if (k in this)
                    {
                        accumulator = this[k--];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (--k < 0)
                        throw new TypeError();
                }
                while (true);
            }

            while (k >= 0)
            {
                if (k in t)
                    accumulator = callbackfn.call(undefined, accumulator, t[k], k, t);
                k--;
            }

            return accumulator;
        };
    }


    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some (JS 1.6)
    if (!Array.prototype.some)
    {
        Array.prototype.some = function(fun /*, thisp */)
        {
            

            if (this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
                throw new TypeError();

            var thisp = arguments[1];
            for (var i = 0; i < len; i++)
            {
                if (i in t && fun.call(thisp, t[i], i, t))
                    return true;
            }

            return false;
        };
    }


    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray (JS 1.8.5)
    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
        };
    }

    // source: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim (JS 1.8.1)
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "");
        };
    }

    // source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP &&
                            oThis ? this : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function () {
            var _hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable("toString"),
            dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
            ],
            dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== "object" && typeof obj !== "function" || obj === null)
                    throw new TypeError("Object.keys called on non-object");

                var result = [];
                for (var prop in obj)
                    if (_hasOwnProperty.call(obj, prop))
                        result.push(prop);

                if (hasDontEnumBug)
                    for (var i=0; i < dontEnumsLength; i++)
                        if (_hasOwnProperty.call(obj, dontEnums[i]))
                            result.push(dontEnums[i]);
                return result;
            };
        })();
    }
});

/**
 * Patterns registry - Central registry and scan logic for patterns
 *
 * Copyright 2012-2013 Simplon B.V.
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2013 Marko Durkovic
 * Copyright 2013 Rok Garbas
 */

/*
 * changes to previous patterns.register/scan mechanism
 * - if you want initialised class, do it in init
 * - init returns set of elements actually initialised
 * - handle once within init
 * - no turnstile anymore
 * - set pattern.jquery_plugin if you want it
 */
define('jam/Patterns/src/registry',[
    "jquery",
    "./core/logger",
    "./utils",
    // below here modules that are only loaded
    "./jquery-ext",
    "./compat"
], function($, logger, utils) {
    var log = logger.getLogger("registry"),
        jquery_plugin = utils.jquery_plugin;

    var disable_re = /patterns-disable=([^&]+)/g,
        disabled = {}, match;

    while ((match=disable_re.exec(window.location.search))!==null) {
        disabled[match[1]] = true;
        log.info('Pattern disabled via url config:', match[1]);
    }

    var registry = {
        patterns: {},
        // as long as the registry is not initialized, pattern
        // registration just registers a pattern. Once init is called,
        // the DOM is scanned. After that registering a new pattern
        // results in rescanning the DOM only for this pattern.
        initialized: false,
        init: function() {
            $(document).ready(function() {
                log.info('loaded: ' + Object.keys(registry.patterns).sort().join(', '));
                registry.scan(document.body);
                registry.initialized = true;
                log.info('finished initial scan.');
            });
        },

        scan: function(content, do_not_catch_init_exception, patterns) {
            var $content = $(content),
                all = [], allsel,
                pattern, $match, plog;

            // If no list of patterns was specified, we scan for all
            // patterns
            patterns = patterns || Object.keys(registry.patterns);

            // selector for all patterns
            patterns.forEach(function(name) {
                if (disabled[name]) {
                    log.debug('Skipping disabled pattern:', name);
                    return;
                }
                pattern = registry.patterns[name];
                if (pattern.transform) {
                    try {
                        pattern.transform($content);
                    } catch (e) {
                        log.error("Transform error for pattern" + name, e);
                    }
                }
                if (pattern.trigger) {
                    all.push(pattern.trigger);
                }
            });
            allsel = all.join(",");

            // Find all elements that belong to any pattern.
            $match = $content.findInclusive(allsel);
            $match = $match.filter(function() { return $(this).parents('pre').length === 0; });
            $match = $match.filter(":not(.cant-touch-this)");

            // walk list backwards and initialize patterns inside-out.
            //
            // XXX: If patterns would only trigger via classes, we
            // could iterate over an element classes and trigger
            // patterns in order.
            //
            // Advantages: Order of pattern initialization controled
            // via order of pat-classes and more efficient.
            $match.toArray().reduceRight(function(acc, el) {
                var $el = $(el);

                for (var name in registry.patterns) {
                    pattern = registry.patterns[name];
                    plog = logger.getLogger("pat." + name);

                    if ($el.is(pattern.trigger)) {
                        plog.debug("Initialising:", $el);
                        try {
                            pattern.init($el);
                            plog.debug("done.");
                        } catch (e) {
                            if (do_not_catch_init_exception) {
                              throw e;
                            } else {
                              plog.error("Caught error:", e);
                            }
                        }
                    }
                }
            }, null);
        },

        // XXX: differentiate between internal and custom patterns
        // _register vs register
        register: function(pattern) {
            if (!pattern.name) {
                log.error("Pattern lacks name:", pattern);
                return false;
            }

            if (registry.patterns[pattern.name]) {
                log.error("Already have a pattern called: " + pattern.name);
                return false;
            }

            // register pattern to be used for scanning new content
            registry.patterns[pattern.name] = pattern;

            // register pattern as jquery plugin
            if (pattern.jquery_plugin) {
                var pluginName = ("pat-" + pattern.name)
                        .replace(/-([a-zA-Z])/g, function(match, p1) {
                            return p1.toUpperCase();
                        });
                $.fn[pluginName] = jquery_plugin(pattern);
                // BBB 2012-12-10
                $.fn[pluginName.replace(/^pat/, "pattern")] = jquery_plugin(pattern);
            }

            log.debug("Registered pattern:", pattern.name, pattern);

            if (registry.initialized) {
                registry.scan(document.body, false, [pattern.name]);
            }
            return true;
        }
    };

    $(document) .on("patterns-injected.patterns", function(ev) {
        registry.scan(ev.target);
        $(ev.target).trigger("patterns-injected-scanned");
    });

    return registry;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
;
// Patterns 
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends: jquery.js
//
// Description: 
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */

define('js/patterns/base',[
  'jquery',
  'jam/Patterns/src/registry',
  'jam/Patterns/src/core/logger'
], function($, registry, logger, undefined) {
  

  function getName(name) {
    return name.replace(/\.(\w)/g, function(match, letter) { return letter.toUpperCase(); });
  }

  function getOptions($el, prefix, options) {
    options = options || {};

    // get options from parent element first, stop if element tag name is 'body'
    if ($el.size() !== 0 && !$.nodeName($el[0], 'body')) {
      options = getOptions($el.parent(), prefix, options);
    }

    // collect all options from element
    if($el.length) {
      $.each($el[0].attributes, function(index, attr) {
        if (attr.name.substr(0, ('data-'+prefix).length) === 'data-'+prefix) {
          var name = attr.name.substr(('data-'+prefix).length+1),
              value = attr.value.replace(/^\s+|\s+$/g, '');  // trim
          if (value.substring(0, 1) === '{' || value.substring(0, 1) === '[') {
            value = JSON.parse(value);
          } else if (value === 'true') {
            value = true;
          } else if (value === 'false') {
            value = false;
          }
          if (name === '') {
            options = value;
          } else {
            var names = name.split('-'),
                names_options = options;
            $.each(names, function(i, name) {
              name = getName(name);
              if (names.length > i + 1) {
                if (!names_options[name]) {
                  names_options[name] = {};
                }
                names_options = names_options[name];
              } else {
                names_options[name] = value;
              }
            });
          }
        }
      });
    }

    return options;
  }

  // Base Pattern
  var Base = function($el, options) {
    this.log = logger.getLogger(this.name);
    this.$el = $el;
    if (this.parser) {
      this.options = $.extend(true, {},
          this.parser.parse($el, this.defaults || {}, this.multipleOptions || false),
          options || {});
    } else {
      this.options = $.extend(true, {},
          this.defaults || {},
          getOptions($el, this.name),
          options || {});
    }
    this.init();
    this.trigger('init');
  };
  Base.prototype = {
    constructor: Base,
    on: function(eventName, eventCallback) {
      this.$el.on(eventName + '.' + this.name + '.patterns', eventCallback);
    },
    trigger: function(eventName) {
      this.$el.trigger(eventName + '.' + this.name + '.patterns', [ this ]);
    }
  };
  Base.extend = function(NewPattern) {
    var Base = this, Constructor;

    if (NewPattern && NewPattern.hasOwnProperty('constructor')) {
      Constructor = NewPattern.constructor;
    } else {
      Constructor = function() { Base.apply(this, arguments); };
    }

    var Surrogate = function() { this.constructor = Constructor; };
    Surrogate.prototype = Base.prototype;
    Constructor.prototype = new Surrogate();

    $.extend(true, Constructor.prototype, NewPattern);

    Constructor.__super__ = Base.prototype;

    if (Constructor.prototype.jqueryPlugin === undefined) {
      Constructor.prototype.jqueryPlugin = "pattern" +
          Constructor.prototype.name.charAt(0).toUpperCase() +
          Constructor.prototype.name.slice(1);
    }
    if (Constructor.prototype.jqueryPlugin) {
      $.fn[Constructor.prototype.jqueryPlugin] = function(method, options) {
        $(this).each(function() {
          var $el = $(this),
              pattern = $el.data('pattern-' + Constructor.prototype.name);
          if (typeof method === "object") {
            options = method;
            method = undefined;
          }
          if (!pattern || typeof(pattern) === 'string') {
            pattern = new Constructor($el, options);
            $el.data('pattern-' + Constructor.prototype.name, pattern);
          } else if (method && pattern && pattern[method]) {
            // TODO: now allow method starts with "_"
            pattern[method].apply(pattern, [options]);
          }

        });
        return this;
      };
    }

    registry.register({
      name: Constructor.prototype.name,
      trigger: '.pat-' + Constructor.prototype.name,
      jquery_plugin: false,
      init: function($all) {
        return $all.each(function(i) {
          var $el = $(this),
              data = $el.data('pattern-' + Constructor.prototype.name + '-' + i);
          if (!data) {
            $el.data('pattern-' + Constructor.prototype.name + '-' + i, new Constructor($el));
          }
        });
      }
    });

    return Constructor;
  };

  return Base;
});

/*
Copyright 2012 Igor Vaynberg

Version: @@ver@@ Timestamp: @@timestamp@@

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
 (function ($) {
 	if(typeof $.fn.each2 == "undefined"){
 		$.fn.extend({
 			/*
			* 4-10 times faster .each replacement
			* use it carefully, as it overrides jQuery context of element on each iteration
			*/
			each2 : function (c) {
				var j = $([0]), i = -1, l = this.length;
				while (
					++i < l
					&& (j.context = j[0] = this[i])
					&& c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
				);
				return this;
			}
 		});
 	}
})(jQuery);

(function ($, undefined) {
    
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition, $document, scrollBarDimensions,

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    },
    MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>";

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    function measureScrollbar () {
        var $template = $( MEASURE_SCROLLBAR_TEMPLATE );
        $template.appendTo('body');

        var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
        };
        $template.remove();

        return dim;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        if (a.constructor === String) return a+'' === b+''; // IE requires a+'' instead of just a
        if (b.constructor === String) return b+'' === a+''; // IE requires b+'' instead of just b
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.bind("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.bind("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }

    $document.bind("mousemove", function (e) {
        lastMousePosition = {x: e.pageX, y: e.pageY};
    });

    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
	    element.bind("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    /**
     * A simple implementation of a thunk
     * @param formula function used to lazily initialize the thunk
     * @return {Function}
     */
    function thunk(formula) {
        var evaluated = false,
            value;
        return function() {
            if (evaluated === false) { value = formula(); evaluated = true; }
            return value;
        };
    };

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.bind("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            if ($el.is(":visible") && el === document.activeElement) {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
        	var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
        	sizer = $(document.createElement("div")).css({
	            position: "absolute",
	            left: "-10000px",
	            top: "-10000px",
	            display: "none",
	            fontSize: style.fontSize,
	            fontFamily: style.fontFamily,
	            fontStyle: style.fontStyle,
	            fontWeight: style.fontWeight,
	            letterSpacing: style.letterSpacing,
	            textTransform: style.textTransform,
	            whiteSpace: "nowrap"
	        });
            sizer.attr("class","select2-sizer");
        	$("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = dest.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }
        classes = src.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);
                    if (adapted) {
                        replacements.push(this);
                    }
                }
            });
        }
        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=text.toUpperCase().indexOf(term.toUpperCase()),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration paramters
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.cache set to true to disable jquery's cache-busting url parameters
     * @param options.jsonpCallback set to override the jquery callback function - useful in conjunction with options.cache
     * @param options.traditional a boolean flag that should be true if you wish to use the traditional style of param serialization for the ajax request
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            requestSequence = 0, // sequence used to drop out-of-order responses
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                requestSequence += 1; // increment the sequence
                var requestNumber = requestSequence, // this request's sequence number
                    data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.ajax,
                    cache = options.cache || false,
                    jsonpCallback = options.jsonpCallback || undefined,
                    type = options.type || 'GET', // set type of request (GET or POST)
                    params = {};

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if( null !== handler) { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    type: type,
                    cache: cache,
                    jsonpCallback: jsonpCallback,
                    success: function (data) {
                        if (requestNumber < requestSequence) {
                            return;
                        }
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        var results = options.results(data, query.page);
                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

		 if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

		 if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            $(isFunc ? data() : data).each(function () {
                var isObject = this.text !== undefined,
                    text = isObject ? this.text : this;
                if (t === "" || query.matcher(t, text)) {
                    filtered.results.push(isObject ? this : {id: this, text: this});
                }
            });
            query.callback(filtered);
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        throw new Error("formatterName must be a function or a falsy value");
    }

    function evaluate(val) {
        return $.isFunction(val) ? val() : val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice(token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results", mask;

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                this.destroy();
            }

            this.enabled=true;
            this.container = this.createContainer();

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            // cache the body so future lookups are cheap
            this.body = thunk(function() { return opts.element.closest("body"); });

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.css(evaluate(opts.containerCss));
            this.container.addClass(evaluate(opts.containerCssClass));

            this.elementTabIndex = this.opts.element.attr("tabindex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .bind("focus.select2", function() { $(this).select2("focus"); })
                .attr("tabindex", "-1")
                .before(this.container);
            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");
            this.dropdown.addClass(evaluate(opts.dropdownCssClass));
            this.dropdown.data("select2", this);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            installFilteredMouseMove(this.results);
            this.dropdown.delegate(resultsSelector, "mousemove-filtered touchstart touchmove touchend", this.bind(this.highlightUnderEvent));

            installDebouncedScroll(80, this.results);
            this.dropdown.delegate(resultsSelector, "scroll-debounced", this.bind(this.loadMoreIfNeeded));

            // do not propagate change event from the search field out of the component
            $(this.container).delegate(".select2-input", "change", function(e) {e.stopPropagation();});
            $(this.dropdown).delegate(".select2-input", "change", function(e) {e.stopPropagation();});

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop(), height;
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.bind("keyup-change input paste", this.bind(this.updateResults));
            search.bind("focus", function () { search.addClass("select2-focused"); });
            search.bind("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.delegate(resultsSelector, "mouseup", this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            this.dropdown.bind("click mouseup mousedown", function (e) { e.stopPropagation(); });

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.element.is(":disabled") || opts.element.is("[readonly='readonly']")) this.disable();

            // Calculate size of scrollbar
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();
        },

        // abstract
        destroy: function () {
            var select2 = this.opts.element.data("select2");

            if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }

            if (select2 !== undefined) {

                select2.container.remove();
                select2.dropdown.remove();
                select2.opts.element
                    .removeClass("select2-offscreen")
                    .removeData("select2")
                    .unbind(".select2")
                    .attr({"tabindex": this.elementTabIndex})
                    .show();
            }
        },

        // abstract
        optionToData: function(element) {
            if (element.is("option")) {
                return {
                    id:element.attr("value"),
                    text:element.text(),
                    element: element.get(),
                    css: element.attr("class"),
                    disabled: equal(element.attr("disabled"), "disabled"),
                    locked: equal(element.attr("locked"), "locked")
                };
            } else if (element.is("optgroup")) {
                return {
                    text:element.attr("label"),
                    children:[],
                    element: element.get(),
                    css: element.attr("class")
                };
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl, self = this;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate,  data, result, children, id=this.opts.id;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                            }

                            node.append(label);

                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            container.append(node);
                        }
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.data("select2Tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, firstChild, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push(self.optionToData(element));
                            }
                        } else if (element.is("optgroup")) {
                            group=self.optionToData(element);
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        firstChild = children[0];
                        if ($(firstChild).text() === "") {
                            children=children.not(firstChild);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
                opts.formatResultCssClass = function(data) { return data.css; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: term, text: term}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator)).each(function () {
                                    var id = this, text = this, tags=opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, id)) { text = this.text; return false; } });
                                    data.push({id: id, text: text});
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, sync;

            el.bind("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            sync = this.bind(function () {

                var enabled, readonly, self = this;

                // sync enabled state

                enabled = this.opts.element.attr("disabled") !== "disabled";
                readonly = this.opts.element.attr("readonly") === "readonly";

                enabled = enabled && !readonly;

                if (this.enabled !== enabled) {
                    if (enabled) {
                        this.enable();
                    } else {
                        this.disable();
                    }
                }


                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.addClass(evaluate(this.opts.containerCssClass));

                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));

            });

            // mozilla and IE
            el.bind("propertychange.select2 DOMAttrModified.select2", sync);
            // safari and chrome
            if (typeof WebKitMutationObserver !== "undefined") {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new WebKitMutationObserver(function (mutations) {
                    mutations.forEach(sync);
                });
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        // abstract
        triggerSelect: function(data) {
            var evt = $.Event("selected", { val: this.id(data), object: data });
            this.opts.element.trigger(evt);
            return !evt.isDefaultPrevented();
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignorea the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        // abstract
        enable: function() {
            if (this.enabled) return;

            this.enabled=true;
            this.container.removeClass("select2-container-disabled");
            this.opts.element.removeAttr("disabled");
        },

        // abstract
        disable: function() {
            if (!this.enabled) return;

            this.close();

            this.enabled=false;
            this.container.addClass("select2-container-disabled");
            this.opts.element.attr("disabled", "disabled");
        },

        // abstract
        opened: function () {
            return this.container.hasClass("select2-dropdown-open");
        },

        // abstract
        positionDropdown: function() {
            var $dropdown = this.dropdown,
                offset = this.container.offset(),
                height = this.container.outerHeight(false),
                width = this.container.outerWidth(false),
                dropHeight = $dropdown.outerHeight(false),
	            viewPortRight = $(window).scrollLeft() + $(window).width(),
                viewportBottom = $(window).scrollTop() + $(window).height(),
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),
	            dropWidth = $dropdown.outerWidth(false),
	            enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
                aboveNow = $dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                css,
                resultsListNode;

            if (this.opts.dropdownAutoWidth) {
                resultsListNode = $('.select2-results', $dropdown)[0];
                $dropdown.addClass('select2-drop-auto-width');
                $dropdown.css('width', '');
                // Add scrollbar width to dropdown if vertical scrollbar is present
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
            }
            else {
                this.container.removeClass('select2-drop-auto-width');
            }

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body().scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static

            if (this.body().css('position') !== 'static') {
                bodyOffset = this.body().offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            // always prefer the current above/below alignment, unless there is not enough room

            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) above = false;
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) above = true;
            }

            if (!enoughRoomOnRight) {
               dropLeft = offset.left + width - dropWidth;
            }

            if (above) {
                dropTop = offset.top - dropHeight;
                this.container.addClass("select2-drop-above");
                $dropdown.addClass("select2-drop-above");
            }
            else {
                this.container.removeClass("select2-drop-above");
                $dropdown.removeClass("select2-drop-above");
            }

            css = $.extend({
                top: dropTop,
                left: dropLeft,
                width: width
            }, evaluate(this.opts.dropdownCss));

            $dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            event = $.Event("opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            window.setTimeout(this.bind(this.opening), 1);

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask;

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.clearDropdownAlignmentPreference();

            if(this.dropdown[0] !== this.body().children().last()[0]) {
                this.dropdown.detach().appendTo(this.body());
            }

            // create the dropdown mask if doesnt already exist
            mask = $("#select2-drop-mask");
            if (mask.length == 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body());
                mask.bind("mousedown touchstart", function (e) {
                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.css(_makeMaskCss());
            mask.show();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");
            this.ensureHighlightVisible();

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).bind(resize+" "+scroll+" "+orient, function (e) {
                    $("#select2-drop-mask").css(_makeMaskCss());
                    that.positionDropdown();
                });
            });

            function _makeMaskCss() {
                return {
                    width  : Math.max(document.documentElement.scrollWidth,  $(window).width()),
                    height : Math.max(document.documentElement.scrollHeight, $(window).height())
                }
            }
        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerId,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).unbind(scroll).unbind(resize).unbind(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open");
            this.results.empty();
            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("close"));
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices().find('.select2-result-label');

            child = $(children[index]);

            hb = child.offset().top + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = child.offset().top - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            return this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.results.find(".select2-highlighted").removeClass("select2-highlighted");

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            this.ensureHighlightVisible();

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "highlight", val: this.id(data), choice: data });
            }
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
        		var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove al highlights
                this.results.find(".select2-highlighted").removeClass("select2-highlighted");
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                offset = -1, // index of first element without data
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);

                    if (data.more===true) {
                        more.detach().appendTo(results).text(self.opts.formatLoadMore(page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search,
                results = this.results,
                opts = this.opts,
                data,
                self = this,
                input,
                term = search.val(),
                lastTerm=$.data(this.container, "select2-last-term");

            // prevent duplicate queries against the same term
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;

            $.data(this.container, "select2-last-term", term);

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            function postRender() {
                results.scrollTop(0);
                search.removeClass("select2-active");
                self.positionDropdown();
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
            	    render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(maxSelSize) + "</li>");
            	    return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + opts.formatInputTooLong(search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + opts.formatSearching() + "</li>");
            }

            search.addClass("select2-active");

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) {
                    this.search.removeClass("select2-active");
                    return;
                }

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(null, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            data.results.unshift(def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();

                this.opts.element.trigger({ type: "loaded", data:data });
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            }
        },

        // abstract
        getPlaceholder: function () {
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder;
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            matches = attrs[i].replace(/\s/g, '')
                                .match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                    // when attached to input type=hidden or elements hidden via css
                    style = this.opts.element.css('width');
                    if (style && style.length > 0) return style;

                    if (this.opts.width === "resolve") {
                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

		createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>",
                "   <span>&nbsp;</span><abbr class='select2-search-choice-close select2-display-none'></abbr>",
                "   <div><b></b></div>" ,
                "</a>",
                "<input class='select2-focusser select2-offscreen' type='text'/>",
                "<div class='select2-drop select2-display-none'>" ,
                "   <div class='select2-search'>" ,
                "       <input type='text' autocomplete='off' class='select2-input'/>" ,
                "   </div>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
            return container;
        },

        // single
        disable: function() {
            if (!this.enabled) return;

            this.parent.disable.apply(this, arguments);

            this.focusser.attr("disabled", "disabled");
        },

        // single
        enable: function() {
            if (this.enabled) return;

            this.parent.enable.apply(this, arguments);

            this.focusser.removeAttr("disabled");
        },

        // single
        opening: function () {
            this.parent.opening.apply(this, arguments);
            if (this.showSearchInput !== false) {
                this.search.val(this.focusser.val());
            }
            this.search.focus();
            this.focusser.attr("disabled", "disabled").val("");
            this.updateResults(true);
            this.opts.element.trigger($.Event("open"));
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
            this.focusser.removeAttr("disabled");
            focus(this.focusser);
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.removeAttr("disabled");
                this.focusser.focus();
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.removeAttr("disabled");
            this.focusser.focus();
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                clickingInside = false;

            this.showSearch(this.opts.minimumResultsForSearch >= 0);

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            // rewrite labels from original element to focusser
            this.focusser.attr("id", "s2id_autogen"+nextUid());

            $("label[for='" + this.opts.element.attr("id") + "']")
                .attr('for', this.focusser.attr('id'));

            this.focusser.attr("tabindex", this.elementTabIndex);

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.TAB:
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.search.bind("blur", this.bind(function(e) {
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying
                if (document.activeElement === this.body().get(0)) {
                    window.setTimeout(this.bind(function() {
                        this.search.focus();
                    }), 0);
                }
            }));

            this.focusser.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {
                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.bind("keyup-change input", this.bind(function(e) {
                e.stopPropagation();
                if (this.opened()) return;
                this.open();
            }));

            selection.delegate("abbr", "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                this.clear();
                killEventImmediately(e);
                this.close();
                this.selection.focus();
            }));

            selection.bind("mousedown", this.bind(function (e) {
                clickingInside = true;

                if (this.opened()) {
                    this.close();
                } else if (this.enabled) {
                    this.open();
                }

                killEvent(e);

                clickingInside = false;
            }));

            dropdown.bind("mousedown", this.bind(function() { this.search.focus(); }));

            selection.bind("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.bind("focus", this.bind(function(){
                this.container.addClass("select2-container-active");
            })).bind("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                }
            }));
            this.search.bind("focus", this.bind(function(){
                this.container.addClass("select2-container-active");
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.setPlaceholder();
        },

        // single
        clear: function(triggerChange) {
            var data=this.selection.data("select2-data");
            if (data) { // guard against queued quick consecutive clicks
                this.opts.element.val("");
                this.selection.find("span").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();

                if (triggerChange !== false){
                    this.opts.element.trigger({ type: "removed", val: this.id(data), choice: data });
                    this.triggerChange({removed:data});
                }
            }
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                    }
                });
            }
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find(":selected");
                    // a single select box always has a value, no need to null check 'selected'
                    callback(self.optionToData(selected));
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    //search in data by id, storing the actual matching item
                    var match = null;
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = equal(id, opts.id(el));
                            if (is_match) {
                                match = el;
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(match);
                        }
                    });
                };
            }

            return opts;
        },

        // single
        getPlaceholder: function() {
            // if a placeholder is specified on a single select without the first empty option ignore it
            if (this.select) {
                if (this.select.find("option").first().text() !== "") {
                    return undefined;
                }
            }

            return this.parent.getPlaceholder.apply(this, arguments);
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.opts.element.val() === "" && placeholder !== undefined) {

                // check for a first blank option if attached to a select
                if (this.select && this.select.find("option:first").text() !== "") return;

                this.selection.find("span").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.container.removeClass("select2-allowclear");
                this.selection.find("abbr").hide();
            }
        },

        // single
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it
            if (noHighlightUpdate !== false) {
                this.highlight(selected);
            }

            // hide the search box if this is the first we got the results and there are a few of them

            if (initial === true) {
                var min=this.opts.minimumResultsForSearch;
                showSearchInput  = min < 0 ? false : countResults(data.results) >= min;
                this.showSearch(showSearchInput);
            }

        },

        // single
        showSearch: function(showSearchInput) {
            this.showSearchInput = showSearchInput;

            this.dropdown.find(".select2-search")[showSearchInput ? "removeClass" : "addClass"]("select2-search-hidden");
            //add "select2-with-searchbox" to the container if search box is shown
            $(this.dropdown, this.container)[showSearchInput ? "addClass" : "removeClass"]("select2-with-searchbox");
        },

        // single
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            var old = this.opts.element.val(),
                oldData = this.data();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            this.close();

            if (!options || !options.noFocus)
                this.selection.focus();

            if (!equal(old, this.id(data))) { this.triggerChange({added:data,removed:oldData}); }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find("span"), formatted;

            this.selection.data("select2-data", data);

            container.empty();
            formatted=this.opts.formatSelection(data, container);
            if (formatted !== undefined) {
                container.append(this.opts.escapeMarkup(formatted));
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.container.addClass("select2-allowclear");
                this.selection.find("abbr").show();
            }
        },

        // single
        val: function () {
            var val,
                triggerChange = false,
                data = null,
                self = this,
                oldData = this.data();

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            if (this.select) {
                this.select
                    .val(val)
                    .find(":selected").each2(function (i, elm) {
                        data = self.optionToData(elm);
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange({added: data, removed:oldData});
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.clear(triggerChange);
                    return;
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange({added: data, removed:oldData});
                    }
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        },

        // single
        data: function(value, triggerChange) {
            var data;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (!value || value === "") {
                    this.clear(triggerChange);
                } else {
                    data = this.data();
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                    if (triggerChange) {
                        this.triggerChange({added: value, removed:data});
                    }
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container select2-container-multi"
            }).html([
                "    <ul class='select2-choices'>",
                //"<li class='select2-search-choice'><span>California</span><a href="javascript:void(0)" class="select2-search-choice-close"></a></li>" ,
                "  <li class='select2-search-field'>" ,
                "    <input type='text' autocomplete='off' class='select2-input'>" ,
                "  </li>" ,
                "</ul>" ,
                "<div class='select2-drop select2-drop-multi select2-display-none'>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
			return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install sthe selection initializer
                opts.initSelection = function (element, callback) {

                    var data = [];

                    element.find(":selected").each2(function (i, elm) {
                        data.push(self.optionToData(elm));
                    });
                    callback(data);
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator);
                    //search in data by array of ids, storing matching items in a list
                    var matches = [];
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                            if (is_match) {
                                matches.push(el);
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(matches);
                        }
                    });
                };
            }

            return opts;
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            // rewrite labels from original element to focusser
            this.search.attr("id", "s2id_autogen"+nextUid());
            $("label[for='" + this.opts.element.attr("id") + "']")
                .attr('for', this.search.attr('id'));

            this.search.bind("input paste", this.bind(function() {
                if (!this.enabled) return;
                if (!this.opened()) {
                    this.open();
                }
            }));

            this.search.attr("tabindex", this.elementTabIndex);

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.BACKSPACE && this.search.val() === "") {
                    this.close();

                    var choices,
                        selected = selection.find(".select2-search-choice-focus");
                    if (selected.length > 0) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        killEvent(e);
                        return;
                    }

                    choices = selection.find(".select2-search-choice:not(.select2-locked)");
                    if (choices.length > 0) {
                        choices.last().addClass("select2-search-choice-focus");
                    }
                } else {
                    selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                    case KEY.TAB:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }

                if (e.which === KEY.ENTER) {
                    // prevent form from being submitted
                    killEvent(e);
                }

            }));

            this.search.bind("keyup", this.bind(this.resizeSearch));

            this.search.bind("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                if (!this.opened()) this.clearSearch();
                e.stopImmediatePropagation();
            }));

            this.container.delegate(selector, "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.clearPlaceholder();
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.delegate(selector, "focus", this.bind(function () {
                if (!this.enabled) return;
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enable: function() {
            if (this.enabled) return;

            this.parent.enable.apply(this, arguments);

            this.search.removeAttr("disabled");
        },

        // multi
        disable: function() {
            if (!this.enabled) return;

            this.parent.disable.apply(this, arguments);

            this.search.attr("disabled", true);
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder(),
                maxWidth = this.getMaxSearchWidth();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
            } else {
                this.search.val("").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        // multi
        opening: function () {
            this.clearPlaceholder(); // should be done before super so placeholder is not used to search
            this.resizeSearch();

            this.parent.opening.apply(this, arguments);

            this.focusSearch();

            this.updateResults(true);
            this.search.focus();
            this.opts.element.trigger($.Event("open"));
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
            //this.opts.element.triggerHandler("focus");
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        // multi
        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer(input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            this.addSelectedChoice(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            if (this.select || !this.opts.closeOnSelect) this.postprocessResults();

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                        // if we reached max selection size repaint the results so choices
                        // are replaced with the max selection reached message
                        this.updateResults(true);
                    }
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                    this.search.width(10);
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            if (!options || !options.noFocus)
                this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted;

            formatted=this.opts.formatSelection(data, choice.find("div"));
            if (formatted != undefined) {
                choice.find("div").replaceWith("<div>"+this.opts.escapeMarkup(formatted)+"</div>");
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .bind("mousedown", killEvent)
                  .bind("click dblclick", this.bind(function (e) {
                  if (!this.enabled) return;

                  $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function(){
                      this.unselect($(e.target));
                      this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                      this.close();
                      this.focusSearch();
                  })).dequeue();
                  killEvent(e);
              })).bind("focus", this.bind(function () {
                  if (!this.enabled) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;

            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            if (!data) {
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                // and invoked on an element already removed
                return;
            }

            index = indexOf(this.id(data), val);

            if (index >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }
            selected.remove();

            this.opts.element.trigger({ type: "removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });
        },

        // multi
        postprocessResults: function () {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });

            compound.each2(function(i, choice) {
                // hide an optgroup if it doesnt have any selectable children
                if (!choice.is('.select2-result-selectable')
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });

            if (this.highlight() == -1){
                self.highlight(0);
            }

        },

        // multi
        getMaxSearchWidth: function() {
            return this.selection.width() - getSideBorderPadding(this.search);
        },

        // multi
        resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
            	sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }

            this.search.width(searchWidth);
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        buildChangeDetails: function (old, current) {
            var current = current.slice(0),
                old = old.slice(0);

            // remove intersection from each array
            for (var i = 0; i < current.length; i++) {
                for (var j = 0; j < old.length; j++) {
                    if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                        current.splice(i, 1);
                        i--;
                        old.splice(j, 1);
                        j--;
                    }
                }
            }

            return {added: current, removed: old};
        },


        // multi
        val: function (val, triggerChange) {
            var oldData, self=this, changeDetails;

            if (arguments.length === 0) {
                return this.getVal();
            }

            oldData=this.data();
            if (!oldData.length) oldData=[];

            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange({added: this.data(), removed: oldData});
                }
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$(data).map(self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange(this.buildChangeDetails(oldData, this.data()));
                    }
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection

            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values, triggerChange) {
            var self=this, ids, old;
            if (arguments.length === 0) {
                 return this.selection
                     .find(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                old = this.data();
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e); });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(old, this.data()));
                }
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            value, multiple, allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "onSortStart", "onSortEnd", "enable", "disable", "positionDropdown", "data"];

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.attr("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new MultiSelect2() : new SingleSelect2();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;
                if (args[0] === "container") {
                    value=select2.container;
                } else {
                    value = select2[args[0]].apply(select2, args.slice(1));
                }
                if (value !== undefined) {return false;}
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        loadMorePadding: 0,
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(result.text, query.term, markup, escapeMarkup);
            return markup.join("");
        },
        formatSelection: function (data, container) {
            return data ? data.text : undefined;
        },
        sortResults: function (results, container, query) {
            return results;
        },
        formatResultCssClass: function(data) {return undefined;},
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1? "" : "s"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results..."; },
        formatSearching: function () { return "Searching..."; },
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumInputLength: null,
        maximumSelectionSize: 0,
        id: function (e) { return e.id; },
        matcher: function(term, text) {
            return (''+text).toUpperCase().indexOf((''+term).toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: function (markup) {
            var replace_map = {
                '\\': '&#92;',
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&apos;',
                "/": '&#47;'
            };

            return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
                    return replace_map[match[0]];
            });
        },
        blurOnChange: false,
        selectOnBlur: false,
        adaptContainerCssClass: function(c) { return c; },
        adaptDropdownCssClass: function(c) { return null; }
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));

define("jam/plone-select2/select2", function(){});

/*! 
 * jquery.event.drag - v 2.2
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
// Created: 2008-06-04 
// Updated: 2012-05-21
// REQUIRES: jquery 1.7.x

;(function( $ ){

// add the jquery instance method
$.fn.drag = function( str, arg, opts ){
	// figure out the event type
	var type = typeof str == "string" ? str : "",
	// figure out the event handler...
	fn = $.isFunction( str ) ? str : $.isFunction( arg ) ? arg : null;
	// fix the event type
	if ( type.indexOf("drag") !== 0 ) 
		type = "drag"+ type;
	// were options passed
	opts = ( str == fn ? arg : opts ) || {};
	// trigger or bind event handler
	return fn ? this.bind( type, opts, fn ) : this.trigger( type );
};

// local refs (increase compression)
var $event = $.event, 
$special = $event.special,
// configure the drag special event 
drag = $special.drag = {
	
	// these are the default settings
	defaults: {
		which: 1, // mouse button pressed to start drag sequence
		distance: 0, // distance dragged before dragstart
		not: ':input', // selector to suppress dragging on target elements
		handle: null, // selector to match handle target elements
		relative: false, // true to use "position", false to use "offset"
		drop: true, // false to suppress drop events, true or selector to allow
		click: false // false to suppress click events after dragend (no proxy)
	},
	
	// the key name for stored drag data
	datakey: "dragdata",
	
	// prevent bubbling for better performance
	noBubble: true,
	
	// count bound related events
	add: function( obj ){ 
		// read the interaction data
		var data = $.data( this, drag.datakey ),
		// read any passed options 
		opts = obj.data || {};
		// count another realted event
		data.related += 1;
		// extend data options bound with this event
		// don't iterate "opts" in case it is a node 
		$.each( drag.defaults, function( key, def ){
			if ( opts[ key ] !== undefined )
				data[ key ] = opts[ key ];
		});
	},
	
	// forget unbound related events
	remove: function(){
		$.data( this, drag.datakey ).related -= 1;
	},
	
	// configure interaction, capture settings
	setup: function(){
		// check for related events
		if ( $.data( this, drag.datakey ) ) 
			return;
		// initialize the drag data with copied defaults
		var data = $.extend({ related:0 }, drag.defaults );
		// store the interaction data
		$.data( this, drag.datakey, data );
		// bind the mousedown event, which starts drag interactions
		$event.add( this, "touchstart mousedown", drag.init, data );
		// prevent image dragging in IE...
		if ( this.attachEvent ) 
			this.attachEvent("ondragstart", drag.dontstart ); 
	},
	
	// destroy configured interaction
	teardown: function(){
		var data = $.data( this, drag.datakey ) || {};
		// check for related events
		if ( data.related ) 
			return;
		// remove the stored data
		$.removeData( this, drag.datakey );
		// remove the mousedown event
		$event.remove( this, "touchstart mousedown", drag.init );
		// enable text selection
		drag.textselect( true ); 
		// un-prevent image dragging in IE...
		if ( this.detachEvent ) 
			this.detachEvent("ondragstart", drag.dontstart ); 
	},
		
	// initialize the interaction
	init: function( event ){ 
		// sorry, only one touch at a time
		if ( drag.touched ) 
			return;
		// the drag/drop interaction data
		var dd = event.data, results;
		// check the which directive
		if ( event.which != 0 && dd.which > 0 && event.which != dd.which ) 
			return; 
		// check for suppressed selector
		if ( $( event.target ).is( dd.not ) ) 
			return;
		// check for handle selector
		if ( dd.handle && !$( event.target ).closest( dd.handle, event.currentTarget ).length ) 
			return;

		drag.touched = event.type == 'touchstart' ? this : null;
		dd.propagates = 1;
		dd.mousedown = this;
		dd.interactions = [ drag.interaction( this, dd ) ];
		dd.target = event.target;
		dd.pageX = event.pageX;
		dd.pageY = event.pageY;
		dd.dragging = null;
		// handle draginit event... 
		results = drag.hijack( event, "draginit", dd );
		// early cancel
		if ( !dd.propagates )
			return;
		// flatten the result set
		results = drag.flatten( results );
		// insert new interaction elements
		if ( results && results.length ){
			dd.interactions = [];
			$.each( results, function(){
				dd.interactions.push( drag.interaction( this, dd ) );
			});
		}
		// remember how many interactions are propagating
		dd.propagates = dd.interactions.length;
		// locate and init the drop targets
		if ( dd.drop !== false && $special.drop ) 
			$special.drop.handler( event, dd );
		// disable text selection
		drag.textselect( false ); 
		// bind additional events...
		if ( drag.touched )
			$event.add( drag.touched, "touchmove touchend", drag.handler, dd );
		else 
			$event.add( document, "mousemove mouseup", drag.handler, dd );
		// helps prevent text selection or scrolling
		if ( !drag.touched || dd.live )
			return false;
	},	
	
	// returns an interaction object
	interaction: function( elem, dd ){
		var offset = $( elem )[ dd.relative ? "position" : "offset" ]() || { top:0, left:0 };
		return {
			drag: elem, 
			callback: new drag.callback(), 
			droppable: [],
			offset: offset
		};
	},
	
	// handle drag-releatd DOM events
	handler: function( event ){ 
		// read the data before hijacking anything
		var dd = event.data;	
		// handle various events
		switch ( event.type ){
			// mousemove, check distance, start dragging
			case !dd.dragging && 'touchmove': 
				event.preventDefault();
			case !dd.dragging && 'mousemove':
				//  drag tolerance, x� + y� = distance�
				if ( Math.pow(  event.pageX-dd.pageX, 2 ) + Math.pow(  event.pageY-dd.pageY, 2 ) < Math.pow( dd.distance, 2 ) ) 
					break; // distance tolerance not reached
				event.target = dd.target; // force target from "mousedown" event (fix distance issue)
				drag.hijack( event, "dragstart", dd ); // trigger "dragstart"
				if ( dd.propagates ) // "dragstart" not rejected
					dd.dragging = true; // activate interaction
			// mousemove, dragging
			case 'touchmove':
				event.preventDefault();
			case 'mousemove':
				if ( dd.dragging ){
					// trigger "drag"		
					drag.hijack( event, "drag", dd );
					if ( dd.propagates ){
						// manage drop events
						if ( dd.drop !== false && $special.drop )
							$special.drop.handler( event, dd ); // "dropstart", "dropend"							
						break; // "drag" not rejected, stop		
					}
					event.type = "mouseup"; // helps "drop" handler behave
				}
			// mouseup, stop dragging
			case 'touchend': 
			case 'mouseup': 
			default:
				if ( drag.touched )
					$event.remove( drag.touched, "touchmove touchend", drag.handler ); // remove touch events
				else 
					$event.remove( document, "mousemove mouseup", drag.handler ); // remove page events	
				if ( dd.dragging ){
					if ( dd.drop !== false && $special.drop )
						$special.drop.handler( event, dd ); // "drop"
					drag.hijack( event, "dragend", dd ); // trigger "dragend"	
				}
				drag.textselect( true ); // enable text selection
				// if suppressing click events...
				if ( dd.click === false && dd.dragging )
					$.data( dd.mousedown, "suppress.click", new Date().getTime() + 5 );
				dd.dragging = drag.touched = false; // deactivate element	
				break;
		}
	},
		
	// re-use event object for custom events
	hijack: function( event, type, dd, x, elem ){
		// not configured
		if ( !dd ) 
			return;
		// remember the original event and type
		var orig = { event:event.originalEvent, type:event.type },
		// is the event drag related or drog related?
		mode = type.indexOf("drop") ? "drag" : "drop",
		// iteration vars
		result, i = x || 0, ia, $elems, callback,
		len = !isNaN( x ) ? x : dd.interactions.length;
		// modify the event type
		event.type = type;
		// remove the original event
		event.originalEvent = null;
		// initialize the results
		dd.results = [];
		// handle each interacted element
		do if ( ia = dd.interactions[ i ] ){
			// validate the interaction
			if ( type !== "dragend" && ia.cancelled )
				continue;
			// set the dragdrop properties on the event object
			callback = drag.properties( event, dd, ia );
			// prepare for more results
			ia.results = [];
			// handle each element
			$( elem || ia[ mode ] || dd.droppable ).each(function( p, subject ){
				// identify drag or drop targets individually
				callback.target = subject;
				// force propagtion of the custom event
				event.isPropagationStopped = function(){ return false; };
				// handle the event	
				result = subject ? $event.dispatch.call( subject, event, callback ) : null;
				// stop the drag interaction for this element
				if ( result === false ){
					if ( mode == "drag" ){
						ia.cancelled = true;
						dd.propagates -= 1;
					}
					if ( type == "drop" ){
						ia[ mode ][p] = null;
					}
				}
				// assign any dropinit elements
				else if ( type == "dropinit" )
					ia.droppable.push( drag.element( result ) || subject );
				// accept a returned proxy element 
				if ( type == "dragstart" )
					ia.proxy = $( drag.element( result ) || ia.drag )[0];
				// remember this result	
				ia.results.push( result );
				// forget the event result, for recycling
				delete event.result;
				// break on cancelled handler
				if ( type !== "dropinit" )
					return result;
			});	
			// flatten the results	
			dd.results[ i ] = drag.flatten( ia.results );	
			// accept a set of valid drop targets
			if ( type == "dropinit" )
				ia.droppable = drag.flatten( ia.droppable );
			// locate drop targets
			if ( type == "dragstart" && !ia.cancelled )
				callback.update(); 
		}
		while ( ++i < len )
		// restore the original event & type
		event.type = orig.type;
		event.originalEvent = orig.event;
		// return all handler results
		return drag.flatten( dd.results );
	},
		
	// extend the callback object with drag/drop properties...
	properties: function( event, dd, ia ){		
		var obj = ia.callback;
		// elements
		obj.drag = ia.drag;
		obj.proxy = ia.proxy || ia.drag;
		// starting mouse position
		obj.startX = dd.pageX;
		obj.startY = dd.pageY;
		// current distance dragged
		obj.deltaX = event.pageX - dd.pageX;
		obj.deltaY = event.pageY - dd.pageY;
		// original element position
		obj.originalX = ia.offset.left;
		obj.originalY = ia.offset.top;
		// adjusted element position
		obj.offsetX = obj.originalX + obj.deltaX; 
		obj.offsetY = obj.originalY + obj.deltaY;
		// assign the drop targets information
		obj.drop = drag.flatten( ( ia.drop || [] ).slice() );
		obj.available = drag.flatten( ( ia.droppable || [] ).slice() );
		return obj;	
	},
	
	// determine is the argument is an element or jquery instance
	element: function( arg ){
		if ( arg && ( arg.jquery || arg.nodeType == 1 ) )
			return arg;
	},
	
	// flatten nested jquery objects and arrays into a single dimension array
	flatten: function( arr ){
		return $.map( arr, function( member ){
			return member && member.jquery ? $.makeArray( member ) : 
				member && member.length ? drag.flatten( member ) : member;
		});
	},
	
	// toggles text selection attributes ON (true) or OFF (false)
	textselect: function( bool ){ 
		$( document )[ bool ? "unbind" : "bind" ]("selectstart", drag.dontstart )
			.css("MozUserSelect", bool ? "" : "none" );
		// .attr("unselectable", bool ? "off" : "on" )
		document.unselectable = bool ? "off" : "on"; 
	},
	
	// suppress "selectstart" and "ondragstart" events
	dontstart: function(){ 
		return false; 
	},
	
	// a callback instance contructor
	callback: function(){}
	
};

// callback methods
drag.callback.prototype = {
	update: function(){
		if ( $special.drop && this.available.length )
			$.each( this.available, function( i ){
				$special.drop.locate( this, i );
			});
	}
};

// patch $.event.$dispatch to allow suppressing clicks
var $dispatch = $event.dispatch;
$event.dispatch = function( event ){
	if ( $.data( this, "suppress."+ event.type ) - new Date().getTime() > 0 ){
		$.removeData( this, "suppress."+ event.type );
		return;
	}
	return $dispatch.apply( this, arguments );
};

// event fix hooks for touch events...
var touchHooks = 
$event.fixHooks.touchstart = 
$event.fixHooks.touchmove = 
$event.fixHooks.touchend =
$event.fixHooks.touchcancel = {
	props: "clientX clientY pageX pageY screenX screenY".split( " " ),
	filter: function( event, orig ) {
		if ( orig ){
			var touched = ( orig.touches && orig.touches[0] )
				|| ( orig.changedTouches && orig.changedTouches[0] )
				|| null; 
			// iOS webkit: touchstart, touchmove, touchend
			if ( touched ) 
				$.each( touchHooks.props, function( i, prop ){
					event[ prop ] = touched[ prop ];
				});
		}
		return event;
	}
};

// share the same special event configuration with related events...
$special.draginit = $special.dragstart = $special.dragend = drag;

})( jQuery );
define("jam/jquery.event.drag/jquery.event.drag", function(){});

/*! 
 * jquery.event.drop - v 2.2
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
// Created: 2008-06-04 
// Updated: 2012-05-21
// REQUIRES: jquery 1.7.x, event.drag 2.2

;(function($){ // secure $ jQuery alias

// Events: drop, dropstart, dropend

// add the jquery instance method
$.fn.drop = function( str, arg, opts ){
	// figure out the event type
	var type = typeof str == "string" ? str : "",
	// figure out the event handler...
	fn = $.isFunction( str ) ? str : $.isFunction( arg ) ? arg : null;
	// fix the event type
	if ( type.indexOf("drop") !== 0 ) 
		type = "drop"+ type;
	// were options passed
	opts = ( str == fn ? arg : opts ) || {};
	// trigger or bind event handler
	return fn ? this.bind( type, opts, fn ) : this.trigger( type );
};

// DROP MANAGEMENT UTILITY
// returns filtered drop target elements, caches their positions
$.drop = function( opts ){ 
	opts = opts || {};
	// safely set new options...
	drop.multi = opts.multi === true ? Infinity : 
		opts.multi === false ? 1 : !isNaN( opts.multi ) ? opts.multi : drop.multi;
	drop.delay = opts.delay || drop.delay;
	drop.tolerance = $.isFunction( opts.tolerance ) ? opts.tolerance : 
		opts.tolerance === null ? null : drop.tolerance;
	drop.mode = opts.mode || drop.mode || 'intersect';
};

// local refs (increase compression)
var $event = $.event, 
$special = $event.special,
// configure the drop special event
drop = $.event.special.drop = {

	// these are the default settings
	multi: 1, // allow multiple drop winners per dragged element
	delay: 20, // async timeout delay
	mode: 'overlap', // drop tolerance mode
		
	// internal cache
	targets: [], 
	
	// the key name for stored drop data
	datakey: "dropdata",
		
	// prevent bubbling for better performance
	noBubble: true,
	
	// count bound related events
	add: function( obj ){ 
		// read the interaction data
		var data = $.data( this, drop.datakey );
		// count another realted event
		data.related += 1;
	},
	
	// forget unbound related events
	remove: function(){
		$.data( this, drop.datakey ).related -= 1;
	},
	
	// configure the interactions
	setup: function(){
		// check for related events
		if ( $.data( this, drop.datakey ) ) 
			return;
		// initialize the drop element data
		var data = { 
			related: 0,
			active: [],
			anyactive: 0,
			winner: 0,
			location: {}
		};
		// store the drop data on the element
		$.data( this, drop.datakey, data );
		// store the drop target in internal cache
		drop.targets.push( this );
	},
	
	// destroy the configure interaction	
	teardown: function(){ 
		var data = $.data( this, drop.datakey ) || {};
		// check for related events
		if ( data.related ) 
			return;
		// remove the stored data
		$.removeData( this, drop.datakey );
		// reference the targeted element
		var element = this;
		// remove from the internal cache
		drop.targets = $.grep( drop.targets, function( target ){ 
			return ( target !== element ); 
		});
	},
	
	// shared event handler
	handler: function( event, dd ){ 
		// local vars
		var results, $targets;
		// make sure the right data is available
		if ( !dd ) 
			return;
		// handle various events
		switch ( event.type ){
			// draginit, from $.event.special.drag
			case 'mousedown': // DROPINIT >>
			case 'touchstart': // DROPINIT >>
				// collect and assign the drop targets
				$targets =  $( drop.targets );
				if ( typeof dd.drop == "string" )
					$targets = $targets.filter( dd.drop );
				// reset drop data winner properties
				$targets.each(function(){
					var data = $.data( this, drop.datakey );
					data.active = [];
					data.anyactive = 0;
					data.winner = 0;
				});
				// set available target elements
				dd.droppable = $targets;
				// activate drop targets for the initial element being dragged
				$special.drag.hijack( event, "dropinit", dd ); 
				break;
			// drag, from $.event.special.drag
			case 'mousemove': // TOLERATE >>
			case 'touchmove': // TOLERATE >>
				drop.event = event; // store the mousemove event
				if ( !drop.timer )
					// monitor drop targets
					drop.tolerate( dd ); 
				break;
			// dragend, from $.event.special.drag
			case 'mouseup': // DROP >> DROPEND >>
			case 'touchend': // DROP >> DROPEND >>
				drop.timer = clearTimeout( drop.timer ); // delete timer	
				if ( dd.propagates ){
					$special.drag.hijack( event, "drop", dd ); 
					$special.drag.hijack( event, "dropend", dd ); 
				}
				break;
				
		}
	},
		
	// returns the location positions of an element
	locate: function( elem, index ){ 
		var data = $.data( elem, drop.datakey ),
		$elem = $( elem ), 
		posi = $elem.offset() || {}, 
		height = $elem.outerHeight(), 
		width = $elem.outerWidth(),
		location = { 
			elem: elem, 
			width: width, 
			height: height,
			top: posi.top, 
			left: posi.left, 
			right: posi.left + width, 
			bottom: posi.top + height
		};
		// drag elements might not have dropdata
		if ( data ){
			data.location = location;
			data.index = index;
			data.elem = elem;
		}
		return location;
	},
	
	// test the location positions of an element against another OR an X,Y coord
	contains: function( target, test ){ // target { location } contains test [x,y] or { location }
		return ( ( test[0] || test.left ) >= target.left && ( test[0] || test.right ) <= target.right
			&& ( test[1] || test.top ) >= target.top && ( test[1] || test.bottom ) <= target.bottom ); 
	},
	
	// stored tolerance modes
	modes: { // fn scope: "$.event.special.drop" object 
		// target with mouse wins, else target with most overlap wins
		'intersect': function( event, proxy, target ){
			return this.contains( target, [ event.pageX, event.pageY ] ) ? // check cursor
				1e9 : this.modes.overlap.apply( this, arguments ); // check overlap
		},
		// target with most overlap wins	
		'overlap': function( event, proxy, target ){
			// calculate the area of overlap...
			return Math.max( 0, Math.min( target.bottom, proxy.bottom ) - Math.max( target.top, proxy.top ) )
				* Math.max( 0, Math.min( target.right, proxy.right ) - Math.max( target.left, proxy.left ) );
		},
		// proxy is completely contained within target bounds	
		'fit': function( event, proxy, target ){
			return this.contains( target, proxy ) ? 1 : 0;
		},
		// center of the proxy is contained within target bounds	
		'middle': function( event, proxy, target ){
			return this.contains( target, [ proxy.left + proxy.width * .5, proxy.top + proxy.height * .5 ] ) ? 1 : 0;
		}
	},	
	
	// sort drop target cache by by winner (dsc), then index (asc)
	sort: function( a, b ){
		return ( b.winner - a.winner ) || ( a.index - b.index );
	},
		
	// async, recursive tolerance execution
	tolerate: function( dd ){		
		// declare local refs
		var i, drp, drg, data, arr, len, elem,
		// interaction iteration variables
		x = 0, ia, end = dd.interactions.length,
		// determine the mouse coords
		xy = [ drop.event.pageX, drop.event.pageY ],
		// custom or stored tolerance fn
		tolerance = drop.tolerance || drop.modes[ drop.mode ];
		// go through each passed interaction...
		do if ( ia = dd.interactions[x] ){
			// check valid interaction
			if ( !ia )
				return; 
			// initialize or clear the drop data
			ia.drop = [];
			// holds the drop elements
			arr = []; 
			len = ia.droppable.length;
			// determine the proxy location, if needed
			if ( tolerance )
				drg = drop.locate( ia.proxy ); 
			// reset the loop
			i = 0;
			// loop each stored drop target
			do if ( elem = ia.droppable[i] ){ 
				data = $.data( elem, drop.datakey );
				drp = data.location;
				if ( !drp ) continue;
				// find a winner: tolerance function is defined, call it
				data.winner = tolerance ? tolerance.call( drop, drop.event, drg, drp ) 
					// mouse position is always the fallback
					: drop.contains( drp, xy ) ? 1 : 0; 
				arr.push( data );	
			} while ( ++i < len ); // loop 
			// sort the drop targets
			arr.sort( drop.sort );			
			// reset the loop
			i = 0;
			// loop through all of the targets again
			do if ( data = arr[ i ] ){
				// winners...
				if ( data.winner && ia.drop.length < drop.multi ){
					// new winner... dropstart
					if ( !data.active[x] && !data.anyactive ){
						// check to make sure that this is not prevented
						if ( $special.drag.hijack( drop.event, "dropstart", dd, x, data.elem )[0] !== false ){ 	
							data.active[x] = 1;
							data.anyactive += 1;
						}
						// if false, it is not a winner
						else
							data.winner = 0;
					}
					// if it is still a winner
					if ( data.winner )
						ia.drop.push( data.elem );
				}
				// losers... 
				else if ( data.active[x] && data.anyactive == 1 ){
					// former winner... dropend
					$special.drag.hijack( drop.event, "dropend", dd, x, data.elem ); 
					data.active[x] = 0;
					data.anyactive -= 1;
				}
			} while ( ++i < len ); // loop 		
		} while ( ++x < end ) // loop
		// check if the mouse is still moving or is idle
		if ( drop.last && xy[0] == drop.last.pageX && xy[1] == drop.last.pageY ) 
			delete drop.timer; // idle, don't recurse
		else  // recurse
			drop.timer = setTimeout(function(){ 
				drop.tolerate( dd ); 
			}, drop.delay );
		// remember event, to compare idleness
		drop.last = drop.event; 
	}
	
};

// share the same special event configuration with related events...
$special.dropinit = $special.dropstart = $special.dropend = drop;

})(jQuery); // confine scope	;
define("jam/jquery.event.drop/jquery.event.drop", function(){});

// plone integration for textext.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends:
//    ++resource++plone.app.jquery.js
//    ++resource++plone.app.widgets/textext.js
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define('js/patterns/select2',[
  'jquery',
  'js/patterns/base',
  'jam/plone-select2/select2',
  'jam/jquery.event.drag/jquery.event.drag',
  'jam/jquery.event.drop/jquery.event.drop'
], function($, Base) {
  

  var Select2 = Base.extend({
    name: "select2",
    defaults: {},
    init: function() {
      var self = this;

      if (self.options.initselection) {
        self.options.initSelection = function ($el, callback) {
          var data = [], value = $el.val(),
              initSelection = self.options.initselection;
          if (typeof(initSelection) === 'string') {
              initSelection = JSON.parse(self.options.initselection);
          }
          $(value.split(",")).each(function () {
            var text = this;
            if (initSelection[this]) {
              text = initSelection[this];
            }
            data.push({id: this, text: text});
          });
          callback(data);
        };
      }


      if (self.options.ajax || self.options.ajax_suggest) {
        if (self.options.ajax_suggest) {
          self.options.multiple = true;
          self.options.ajax = self.options.ajax || {};
          self.options.ajax.url = self.options.ajax_suggest;
          self.options.initSelection = function ($el, callback) {
            var data = [], value = $el.val();
            $(value.split(",")).each(function () {
              data.push({id: this, text: this});
            });
            callback(data);
          };
        }
        var query_term = '';
        self.options.ajax = $.extend({
          quietMillis: 300,
          data: function (term, page) {
            query_term = term;
            return {
              query: term,
              page_limit: 10,
              page: page
            };
          },
          results: function (data, page) {
            var results = data.results;
            if (self.options.ajax_suggest) {
              var data_ids = [];
              $.each(data.results, function(i, item) {
                data_ids.push(item.id);
              });
              results = [];
              if (query_term !== ''  && $.inArray(query_term, data_ids) === -1) {
                results.push({id:query_term, text:query_term});
              }
              $.each(data.results, function(i, item) {
                if (self.options.ajax_suggest) {
                  results.push({ id: item.text, text: item.text });
                } else {
                  results.push(item);
                }
              });
            }
            return { results: results };
          }
        }, self.options.ajax);
      }

      if (self.options.tags && typeof(self.options) === 'string') {
        if (self.options.tags.substr(0, 1) === '[') {
          self.options.tags = JSON.parse(self.options.tags);
        } else {
          self.options.tags = self.options.tags.split(',');
        }
      }

      if (self.options.orderable) {
        self.options.formatSelection = function(data, $container) {
          $container.parents('li')
            .css({'cursor': 'move'})
            .drag("start", function(e, dd) {
              $(this).addClass('select2-choice-dragging');
              self.$el.select2("onSortStart");
              $.drop({
                tolerance: function(event, proxy, target) {
                  var test = event.pageY > (target.top + target.height / 2);
                  $.data(target.elem, "drop+reorder",
                         test ? "insertAfter" : "insertBefore" );
                  return this.contains(target, [event.pageX, event.pageY]);
                }
              });
            })
            .drag(function(e, dd) {
              var drop = dd.drop[0],
              method = $.data(drop || {}, "drop+reorder");
              if (drop && (drop != dd.current || method != dd.method)){
                $(this)[method](drop);
                dd.current = drop;
                dd.method = method;
                dd.update();
              }
            })
            .drag("end", function(e, dd) {
              $(this).removeClass('select2-choice-dragging');
              self.$el.select2("onSortEnd");
            })
            .drop("init", function(e, dd ) {
              return !(this == dd.drag);
            });
          return data ? data.text : undefined;
        };
      }

      self.$el.select2(self.options);
      self.$el.parent().off('close.modal.patterns');
    }
  });

  return Select2;

});

/*!
 * pickadate.js v2.1.7 - 25 March, 2013
 * By Amsul (http://amsul.ca)
 * Hosted on https://github.com/amsul/pickadate.js
 * Licensed under MIT ("expat" flavour) license.
 */

/*jshint
   debug: true,
   devel: true,
   browser: true,
   asi: true,
   unused: true,
   eqnull: true
 */



;(function( $, document, undefined ) {

    



    var

        // Globals & constants
        DAYS_IN_WEEK = 7,
        WEEKS_IN_CALENDAR = 6,
        DAYS_IN_CALENDAR = WEEKS_IN_CALENDAR * DAYS_IN_WEEK,

        STRING_DIV = 'div',
        STRING_PREFIX_DATEPICKER = 'pickadate__',

        isIE = navigator.userAgent.match( /MSIE/ ),

        $document = $( document ),

        $body = $( document.body ),


        /**
         * The picker constructor that accepts the
         * jQuery element and the merged settings
         */
        Picker = function( $ELEMENT, SETTINGS ) {

            var
                // Pseudo picker constructor
                Picker = function() {},


                // The picker prototype
                P = Picker.prototype = {

                    constructor: Picker,

                    $node: $ELEMENT,

                    /**
                     * Initialize everything
                     */
                    init: function() {


                        // Bind all the events to the element,
                        // and then insert everything after it
                        $ELEMENT.on({
                            'focus click': function() {

                                // If it's not IE or it is IE and the calendar is not
                                // being force closed, then open the calendar
                                if ( !isIE || ( isIE && !CALENDAR._IE ) ) {
                                    P.open()
                                }

                                // Add the focused state to the holder
                                $HOLDER.addClass( CLASSES.focused )

                                // Then flip the IE force close to false
                                CALENDAR._IE = 0
                            },
                            blur: function() {
                                $HOLDER.removeClass( CLASSES.focused )
                            },
                            change: function() {

                                // If there's a hidden input, update the value with formatting or clear it
                                if ( ELEMENT_HIDDEN ) {
                                    ELEMENT_HIDDEN.value = ELEMENT.value ? getDateFormatted( SETTINGS.formatSubmit ) : ''
                                }
                            },
                            keydown: function( event ) {

                                var
                                    // Grab the keycode
                                    keycode = event.keyCode,

                                    // Check if one of the delete keys was pressed
                                    isKeycodeDelete = keycode == 8 || keycode == 46

                                // If backspace was pressed or the calendar is closed and the keycode
                                // warrants a date change, prevent it from going any further.
                                if ( isKeycodeDelete || !CALENDAR.isOpen && KEYCODE_TO_DATE[ keycode ] ) {

                                    // Prevent it from moving the page
                                    event.preventDefault()

                                    // Prevent it from propagating to document
                                    eventPreventPropagation( event )

                                    // If backspace was pressed, clear the values and close the picker
                                    if ( isKeycodeDelete ) {
                                        P.clear().close()
                                    }

                                    // Otherwise open the calendar
                                    else {
                                        P.open()
                                    }
                                }
                            }
                        }).after( [ $HOLDER, ELEMENT_HIDDEN ] )


                        // If the element has autofocus, open the calendar
                        if ( ELEMENT.autofocus ) {
                            P.open()
                        }


                        // Update the calendar items
                        CALENDAR.items = getUpdatedCalendarItems()


                        // Trigger the `onStart` method within scope of the picker
                        triggerFunction( SETTINGS.onStart, P )

                        // Trigger the `onRender` method within scope of the picker
                        triggerFunction( SETTINGS.onRender, P )

                        return P
                    }, //init


                    /**
                     * Open the calendar
                     */
                    open: function() {

                        // If it's already open, do nothing
                        if ( CALENDAR.isOpen ) return P


                        // Set calendar as open
                        CALENDAR.isOpen = 1


                        // Toggle the tabindex of "focusable" calendar items
                        toggleCalendarElements( 0 )


                        // Make sure the element has focus and then
                        // add the "active" class to the element
                        $ELEMENT.focus().addClass( CLASSES.inputActive )

                        // Add the "opened" class to the calendar holder
                        $HOLDER.addClass( CLASSES.opened )

                        // Add the "active" class to the body
                        $body.addClass( CLASSES.bodyActive )


                        // Bind all the events to the document
                        // while namespacing it with the calendar ID
                        $document.on( 'focusin.P' + CALENDAR.id, function( event ) {

                            // If the target is not within the holder,
                            // and is not the element, then close the picker
                            if ( !$HOLDER.find( event.target ).length && event.target != ELEMENT ) P.close()

                        }).on( 'click.P' + CALENDAR.id, function( event ) {

                            // If the target of the click is not the element,
                            // then close the calendar picker
                            // * We don't worry about clicks on the holder
                            //   because those are stopped from bubbling to the doc
                            if ( event.target != ELEMENT ) P.close()

                        }).on( 'keydown.P' + CALENDAR.id, function( event ) {

                            var
                                // Get the keycode
                                keycode = event.keyCode,

                                // Translate that to a date change
                                keycodeToDate = KEYCODE_TO_DATE[ keycode ]


                            // On escape, focus back onto the element and close the picker
                            if ( keycode == 27 ) {
                                ELEMENT.focus()
                                P.close()
                            }


                            // If the target is the element and there's a keycode to date
                            // translation or the enter key was pressed
                            else if ( event.target == ELEMENT && ( keycodeToDate || keycode == 13 ) ) {

                                // Prevent the default action to stop it from moving the page
                                event.preventDefault()

                                // If the keycode translates to a date change, superficially select
                                // the date by incrementally (by date change) creating new validated dates.
                                // * Truthy second argument makes it a superficial selection
                                if ( keycodeToDate ) {
                                    setDateSelected( createValidatedDate( [ MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH, DATE_HIGHLIGHTED.DATE + keycodeToDate ], keycodeToDate ), 1 )
                                }

                                // Otherwise it's the enter key so set the element value as the
                                // highlighted date, render a new calendar, and then close it
                                else {
                                    setElementsValue( DATE_HIGHLIGHTED )
                                    calendarRender()
                                    P.close()
                                }

                            } //if ELEMENT
                        })


                        // Trigger the onOpen method within scope of the picker
                        triggerFunction( SETTINGS.onOpen, P )

                        return P
                    }, //open


                    /**
                     * Close the calendar
                     */
                    close: function() {

                        // If it's already closed, do nothing
                        if ( !CALENDAR.isOpen ) return P


                        // Set calendar as closed
                        CALENDAR.isOpen = 0


                        // Toggle the tabindex of "focusable" calendar items
                        toggleCalendarElements( -1 )


                        // Remove the "active" class from the element
                        $ELEMENT.removeClass( CLASSES.inputActive )

                        // Remove the "opened" class from the calendar holder
                        $HOLDER.removeClass( CLASSES.opened )

                        // Remove the "active" class from the body
                        $body.removeClass( CLASSES.bodyActive )


                        // Unbind the Picker events from the document
                        $document.off( '.P' + CALENDAR.id )


                        // Trigger the onClose method within scope of the picker
                        triggerFunction( SETTINGS.onClose, P )

                        return P
                    }, //close


                    /**
                     * Return whether the calendar is open
                     */
                    isOpen: function() {
                        return CALENDAR.isOpen === 1;
                    }, //isOpen


                    /**
                     * Show a month in focus with 0index compensation
                     */
                    show: function( month, year ) {
                        showMonth( --month, year )
                        return P
                    }, //show


                    /**
                     * Clear the value of the input elements
                     */
                    clear: function() {

                        // Clear the elements value
                        setElementsValue( 0 )

                        // Render a new calendar
                        calendarRender()

                        return P
                    }, //clear


                    /**
                     * Get the selected date in any format.
                     */
                    getDate: function( format ) {

                        // If the format is a literal true, return the underlying JS Date object.
                        // If the element has no value, just return an empty string.
                        // Otherwise return the formatted date.
                        return format === true ? DATE_SELECTED.OBJ : !ELEMENT.value ? '' : getDateFormatted( format )
                    }, //getDate


                    /**
                     * Set the date with month 0index compensation
                     * and an option to do a superficial selection
                     */
                    setDate: function( year, month, date, isSuperficial ) {
                        setDateSelected( createValidatedDate([ year, --month, date ]), isSuperficial )
                        return P
                    }, //setDate


                    /**
                     * Get the min or max date based on `upper` being truthy or falsey
                     */
                    getDateLimit: function( upper, format ) {
                        return getDateFormatted( format, upper ? DATE_MAX : DATE_MIN )
                    }, //getDateLimit


                    /**
                     * Set the min or max date based on `upper` being truthy or falsey.
                     */
                    setDateLimit: function( limit, upper ) {

                        // If it's the upper limit
                        if ( upper ) {

                            // Set the max date
                            DATE_MAX = createBoundaryDate( limit, upper )

                            // If focused month is more than max date set it to max date
                            if ( MONTH_FOCUSED.TIME > DATE_MAX.TIME ) {
                                MONTH_FOCUSED = DATE_MAX
                            }
                        }

                        // Otherwise it's the lower limit
                        else {

                            // So set the min date
                            DATE_MIN = createBoundaryDate( limit )

                            // If focused month is less than min date set it to min date
                            if ( MONTH_FOCUSED.TIME < DATE_MIN.TIME ) {
                                MONTH_FOCUSED = DATE_MIN
                            }
                        }

                        // Render a new calendar
                        calendarRender()

                        return P
                    } //setDateLimit
                }, //Picker.prototype


                // The element node
                ELEMENT = (function( element ) {

                    // Confirm the focus state, convert the element into
                    // a regular text input to remove user-agent stylings,
                    // and then set it as readonly to prevent keyboard popup
                    element.autofocus = ( element == document.activeElement )
                    element.type = 'text'
                    element.readOnly = true
                    return element
                })( $ELEMENT[ 0 ] ), //ELEMENT


                // The calendar object
                CALENDAR = {
                    id: ~~( Math.random() * 1e9 )
                }, //CALENDAR


                // The classes
                CLASSES = SETTINGS.klass,


                // The date in various formats
                DATE_FORMATS = (function() {

                    // Get the length of the first word
                    function getFirstWordLength( string ) {
                        return string.match( /\w+/ )[ 0 ].length
                    }

                    // If the second character is a digit, length is 2 otherwise 1.
                    function getDigitsLength( string ) {
                        return ( /\d/ ).test( string[ 1 ] ) ? 2 : 1
                    }

                    // Get the length of the month from a string
                    function getMonthLength( string, dateObj, collection ) {

                        // Grab the first word
                        var word = string.match( /\w+/ )[ 0 ]

                        // If there's no index for the date object's month,
                        // find it in the relevant months collection and add 1
                        // because we subtract 1 when we create the date object
                        if ( !dateObj.mm && !dateObj.m ) {
                            dateObj.m = collection.indexOf( word ) + 1
                        }

                        // Return the length of the word
                        return word.length
                    }


                    // Return the date formats object
                    return {
                        d: function( string ) {

                            // If there's string, then get the digits length.
                            // Otherwise return the selected date.
                            return string ? getDigitsLength( string ) : this.DATE
                        },
                        dd: function( string ) {

                            // If there's a string, then the length is always 2.
                            // Otherwise return the selected date with a leading zero.
                            return string ? 2 : leadZero( this.DATE )
                        },
                        ddd: function( string ) {

                            // If there's a string, then get the length of the first word.
                            // Otherwise return the short selected weekday.
                            return string ? getFirstWordLength( string ) : SETTINGS.weekdaysShort[ this.DAY ]
                        },
                        dddd: function( string ) {

                            // If there's a string, then get the length of the first word.
                            // Otherwise return the full selected weekday.
                            return string ? getFirstWordLength( string ) : SETTINGS.weekdaysFull[ this.DAY ]
                        },
                        m: function( string ) {

                            // If there's a string, then get the length of the digits
                            // Otherwise return the selected month with 0index compensation.
                            return string ? getDigitsLength( string ) : this.MONTH + 1
                        },
                        mm: function( string ) {

                            // If there's a string, then the length is always 2.
                            // Otherwise return the selected month with 0index and leading zero.
                            return string ? 2 : leadZero( this.MONTH + 1 )
                        },
                        mmm: function( string, dateObject ) {

                            var collection = SETTINGS.monthsShort

                            // If there's a string, get length of the relevant month string
                            // from the short months collection. Otherwise return the
                            // selected month from that collection.
                            return string ? getMonthLength( string, dateObject, collection ) : collection[ this.MONTH ]
                        },
                        mmmm: function( string, dateObject ) {

                            var collection = SETTINGS.monthsFull

                            // If there's a string, get length of the relevant month string
                            // from the full months collection. Otherwise return the
                            // selected month from that collection.
                            return string ? getMonthLength( string, dateObject, collection ) : collection[ this.MONTH ]
                        },
                        yy: function( string ) {

                            // If there's a string, then the length is always 2.
                            // Otherwise return the selected year by slicing out the first 2 digits.
                            return string ? 2 : ( '' + this.YEAR ).slice( 2 )
                        },
                        yyyy: function( string ) {

                            // If there's a string, then the length is always 4.
                            // Otherwise return the selected year.
                            return string ? 4 : this.YEAR
                        },

                        // Create an array by splitting the format passed
                        toArray: function( format ) { return format.split( /(?=\b)(d{1,4}|m{1,4}|y{4}|yy)+(\b)/g ) }

                    } //endreturn
                })(), //DATE_FORMATS


                // Create calendar object for today
                DATE_TODAY = createDate(),


                // Create the min date
                DATE_MIN = createBoundaryDate( SETTINGS.dateMin ),


                // Create the max date
                // * A truthy second argument creates max date
                DATE_MAX = createBoundaryDate( SETTINGS.dateMax, 1 ),


                // Create a pseudo min and max date for disabled
                // calendars as the respective opposite limit
                PSEUDO_DATE_MIN = DATE_MAX,
                PSEUDO_DATE_MAX = DATE_MIN,


                // Create a collection of dates to disable
                DATES_TO_DISABLE = (function( datesCollection ) {

                    // If a collection was passed, we need to create calendar date objects
                    if ( Array.isArray( datesCollection ) ) {

                        // If the "all" flag is true, remove the flag from the collection
                        // and flip the condition of which dates to disable
                        if ( datesCollection[ 0 ] === true ) {
                            CALENDAR.off = datesCollection.shift()
                        }

                        // Map through the dates passed and return the collection
                        return datesCollection.map( function( date ) {

                            // If the date is a number, we need to disable weekdays
                            if ( !isNaN( date ) ) {

                                // So flip the "off days" boolean
                                CALENDAR.offDays = 1

                                // If the first day flag is truthy, we maintain the
                                // 0index of the date by getting the remainder from 7.
                                // Otherwise return the date with 0index compensation.
                                return SETTINGS.firstDay ? date % DAYS_IN_WEEK : --date
                            }

                            // Otherwise assume it's an array and fix the month 0index
                            --date[ 1 ]

                            // Then create and return the date,
                            // replacing it in the collection
                            return createDate( date )
                        })
                    }
                })( SETTINGS.datesDisabled ), //DATES_TO_DISABLE


                // Create a function that will filter through the dates
                // and return true if looped date is to be disabled
                DISABLED_DATES = (function() {

                    // Check if the looped date should be disabled
                    // based on the time being the same as a disabled date
                    // or the day index being within the collection
                    var isDisabledDate = function( date ) {
                        return this.TIME == date.TIME || DATES_TO_DISABLE.indexOf( this.DAY ) > -1
                    }


                    // If all calendar dates should be disabled
                    if ( CALENDAR.off ) {

                        // Map through all the dates to disable
                        DATES_TO_DISABLE.map( function( loopDate ) {

                            // If the looped date is less than the latest lowest date
                            // and greater than the minimum date, then set it as the lowest date
                            if ( loopDate.TIME < PSEUDO_DATE_MIN.TIME && loopDate.TIME > DATE_MIN.TIME ) {
                                PSEUDO_DATE_MIN = loopDate
                            }

                            // If the looped date is more than the latest highest date
                            // and less than the maximum date, then set it as the highest date
                            if ( loopDate.TIME > PSEUDO_DATE_MAX.TIME && loopDate.TIME <= DATE_MAX.TIME ) {
                                PSEUDO_DATE_MAX = loopDate
                            }
                        })

                        // Finally, return a function that maps each date
                        // in the collection of dates to not disable.
                        return function( date, i, collection ) {

                            // Map the array of disabled dates and check if this is not one
                            return ( collection.map( isDisabledDate, this ).indexOf( true ) < 0 )
                        }
                    }


                    // Otherwise just return the function that checks if a date is disabled
                    return isDisabledDate
                })(), //DISABLED_DATES


                // Create calendar object for the highlighted day
                DATE_HIGHLIGHTED = (function( dateDataValue, dateEntered ) {

                    // If there a date `data-value`
                    if ( dateDataValue ) {

                        // Set the date entered to an empty object
                        dateEntered = {}

                        // Map through the submit format array
                        DATE_FORMATS.toArray( SETTINGS.formatSubmit ).map( function( formatItem ) {

                            // If the formatting length function exists, invoke it
                            // with the `data-value` and the date we are creating.
                            // Otherwise it's the length of the formatting item being mapped
                            var formattingLength = DATE_FORMATS[ formatItem ] ? DATE_FORMATS[ formatItem ]( dateDataValue, dateEntered ) : formatItem.length

                            // If the formatting length function exists, slice up
                            // the value and pass it into the date we're creating.
                            if ( DATE_FORMATS[ formatItem ] ) {
                                dateEntered[ formatItem ] = dateDataValue.slice( 0, formattingLength )
                            }

                            // Update the remainder of the string by slicing away the format length
                            dateDataValue = dateDataValue.slice( formattingLength )
                        })

                        // Finally, create an array with the date entered while
                        // parsing each item as an integer and compensating for 0index
                        dateEntered = [ +(dateEntered.yyyy || dateEntered.yy), +(dateEntered.mm || dateEntered.m) - 1, +(dateEntered.dd || dateEntered.d) ]
                    }


                    // Otherwise, try to natively parse the date in the input
                    else {
                        dateEntered = Date.parse( dateEntered )
                    }


                    // If there's a valid date in the input or the dateEntered
                    // is now an array, create a validated date with it.
                    // Otherwise set the highlighted date to today after validating.
                    return createValidatedDate( dateEntered && ( !isNaN( dateEntered ) || Array.isArray( dateEntered ) ) ? dateEntered : DATE_TODAY )
                })( ELEMENT.getAttribute( 'data-value' ), ELEMENT.value ),


                // The date selected is initially the date highlighted
                DATE_SELECTED = DATE_HIGHLIGHTED,


                // Month focused is based on highlighted date
                MONTH_FOCUSED = DATE_HIGHLIGHTED,


                // If there's a format for the hidden input element, create the element
                // using the name of the original input plus suffix and update the value
                // with whatever is entered in the input on load. Otherwise set it to null.
                ELEMENT_HIDDEN = SETTINGS.formatSubmit ? $( '<input type=hidden name=' + ELEMENT.name + SETTINGS.hiddenSuffix + '>' ).val( ELEMENT.value ? getDateFormatted( SETTINGS.formatSubmit ) : '' )[ 0 ] : null,


                // Create the calendar table head with weekday labels
                // by "copying" the weekdays collection based on the settings.
                // * We do a copy so we don't mutate the original array.
                TABLE_HEAD = (function( weekdaysCollection ) {

                    // If the first day should be Monday, then grab
                    // Sunday and push it to the end of the collection
                    if ( SETTINGS.firstDay ) {
                        weekdaysCollection.push( weekdaysCollection.splice( 0, 1 )[ 0 ] )
                    }

                    // Go through each day of the week and return a wrapped header row.
                    // Take the result and apply anoth table head wrapper to group it all.
                    return createNode( 'thead',
                        createNode( 'tr',
                            weekdaysCollection.map( function( weekday ) {
                                return createNode( 'th', weekday, CLASSES.weekdays )
                            })
                        )
                    )
                })( ( SETTINGS.showWeekdaysShort ? SETTINGS.weekdaysShort : SETTINGS.weekdaysFull ).slice( 0 ) ), //TABLE_HEAD


                // Create the calendar holder with a new wrapped calendar and bind the events
                $HOLDER = $( createNode( STRING_DIV, createCalendarWrapped(), CLASSES.holder ) ).on( 'mousedown', function( event ) {

                    // If the target of the event is not one of the calendar items,
                    // prevent default action to keep focus on the input element
                    if ( CALENDAR.items.indexOf( event.target ) < 0 ) {
                        event.preventDefault()
                    }
                }).on( 'click', function( event ) {

                    // If the calendar is closed and there appears to be no click, do nothing
                    // * This is done to prevent the "enter" key propagating as a click.
                    //   On all browsers (except old IEs) the client click x & y are 0.
                    if ( !CALENDAR.isOpen && !event.clientX && !event.clientY ) {
                        return
                    }

                    var
                        dateToSelect,

                        // Get the jQuery target
                        $target = $( event.target ),

                        // Get the target data
                        targetData = $target.data()


                    // Stop the event from bubbling to the document
                    eventPreventPropagation( event )


                    // Put focus back onto the element
                    ELEMENT.focus()

                    // For IE, set the calendar to force close
                    // * This needs to be after `ELEMENT.focus()`
                    CALENDAR._IE = 1


                    // If a navigator button was clicked,
                    // show the month in the relative direction
                    if ( targetData.nav ) {
                        showMonth( MONTH_FOCUSED.MONTH + targetData.nav )
                    }

                    // If a clear button was clicked,
                    // clear the elements value and then close it
                    else if ( targetData.clear ) {
                        P.clear().close()
                    }

                    // If a date was clicked
                    else if ( targetData.date ) {

                        // Split the target data into an array
                        dateToSelect = targetData.date.split( '/' )

                        // Set the date and then close the calendar
                        P.setDate( +dateToSelect[ 0 ], +dateToSelect[ 1 ], +dateToSelect[ 2 ] ).close()
                    }

                    // If the target is the holder, close the picker
                    else if ( $target[ 0 ] == $HOLDER[ 0 ] ) {
                        P.close()
                    }
                }), // $HOLDER


                // Translate a keycode to a relative change in date
                KEYCODE_TO_DATE = {

                    // Down
                    40: 7,

                    // Up
                    38: -7,

                    // Right
                    39: 1,

                    // Left
                    37: -1
                } //KEYCODE_TO_DATE



            /**
             * Create a bounding date allowed on the calendar
             * * A truthy second argument creates the upper boundary
             */
            function createBoundaryDate( limit, upper ) {

                // If the limit is set to true, just return today
                if ( limit === true ) {
                    return DATE_TODAY
                }

                // If the limit is an array, construct the date by fixing month 0index
                if ( Array.isArray( limit ) ) {
                    --limit[ 1 ]
                    return createDate( limit )
                }

                // If there is a limit and its a number, create a
                // calendar date relative to today by adding the limit
                if ( limit && !isNaN( limit ) ) {
                    return createDate([ DATE_TODAY.YEAR, DATE_TODAY.MONTH, DATE_TODAY.DATE + limit ])
                }

                // Otherwise create an infinite date
                return createDate( 0, upper ? Infinity : -Infinity )
            } //createBoundaryDate


            /**
             * Create a validated date
             */
            function createValidatedDate( datePassed, direction, skipMonthCheck ) {


                // If the date passed isn't a date, create one
                datePassed = !datePassed.TIME ? createDate( datePassed ) : datePassed


                // If the calendar "disabled" flag is truthy and there are only disabled weekdays
                if ( CALENDAR.off && !CALENDAR.offDays ) {

                    // If the date is less than the pseudo min date or greater than pseudo max date,
                    // set it as the pseudo date limit. Otherwise keep it the same.
                    datePassed = datePassed.TIME < PSEUDO_DATE_MIN.TIME ? PSEUDO_DATE_MIN : datePassed.TIME > PSEUDO_DATE_MAX.TIME ? PSEUDO_DATE_MAX : datePassed
                }

                // Otherwise if there are disabled dates
                else if ( DATES_TO_DISABLE ) {

                    // Create a reference to the original date passed
                    var originalDate = datePassed

                    // Check if this date is disabled. If it is,
                    // then keep adding the direction (or 1) to the date
                    // until we get to a date that's enabled.
                    while ( DATES_TO_DISABLE.filter( DISABLED_DATES, datePassed ).length ) {

                        // Otherwise create the next date based on the direction
                        datePassed = createDate([ datePassed.YEAR, datePassed.MONTH, datePassed.DATE + ( direction || 1 ) ])

                        // Check if the month check should be skipped to avoid extra loops.
                        // Otherwise if we've gone through to another month, create a new
                        // date based on the direction being less than zero (rather than more).
                        // Then set this new date as the original and looped date.
                        if ( !skipMonthCheck && datePassed.MONTH != originalDate.MONTH ) {
                            originalDate = datePassed = createDate([ originalDate.YEAR, originalDate.MONTH, direction < 0 ? --originalDate.DATE : ++originalDate.DATE ])
                        }
                    }
                }


                // If it's less that min date, set it to min date
                // by creating a validated date by adding one
                // until we find an enabled date
                // * A truthy third argument skips the month check
                if ( datePassed.TIME < DATE_MIN.TIME ) {
                    datePassed = createValidatedDate( DATE_MIN, 1, 1 )
                }


                // If it's more than max date, set it to max date
                // by creating a validated date by subtracting one
                // until we find an enabled date
                // * A truthy third argument skips the month check
                else if ( datePassed.TIME > DATE_MAX.TIME ) {
                    datePassed = createValidatedDate( DATE_MAX, -1, 1 )
                }


                // Finally, return the date
                return datePassed
            } //createValidatedDate


            /**
             * Create the nav for next/prev month
             */
            function createMonthNav( next ) {

                // If the focused month is outside the range, return an empty string
                if ( ( next && MONTH_FOCUSED.YEAR >= DATE_MAX.YEAR && MONTH_FOCUSED.MONTH >= DATE_MAX.MONTH ) || ( !next && MONTH_FOCUSED.YEAR <= DATE_MIN.YEAR && MONTH_FOCUSED.MONTH <= DATE_MIN.MONTH ) ) {
                    return ''
                }

                // Otherwise, return the created month tag
                var monthTag = 'month' + ( next ? 'Next' : 'Prev' )
                return createNode( STRING_DIV, SETTINGS[ monthTag ], CLASSES[ monthTag ], 'data-nav=' + ( next || -1 ) )
            } //createMonthNav


            /**
             * Create the month label
             */
            function createMonthLabel( monthsCollection ) {


                // If there's a need for a month selector
                return SETTINGS.monthSelector ?

                    // Create the dom string node for a select element
                    createNode( 'select',

                        // Map through the months collection
                        monthsCollection.map( function( month, monthIndex ) {

                            // Create a dom string node for each option
                            return createNode( 'option',

                                // With the month and no classes
                                month, 0,

                                // Set the value and selected index
                                'value=' + monthIndex + ( MONTH_FOCUSED.MONTH == monthIndex ? ' selected' : '' ) +

                                // Plus the disabled attribute if it's outside the range
                                getMonthInRange( monthIndex, MONTH_FOCUSED.YEAR, ' disabled', '' )
                            )
                        }),

                        // The month selector class
                        CLASSES.selectMonth,

                        // And some tabindex
                        getTabindexState()

                    // Otherwise just return the month focused
                    ) : createNode( STRING_DIV, monthsCollection[ MONTH_FOCUSED.MONTH ], CLASSES.month )
            } //createMonthLabel


            /**
             * Create the year label
             */
            function createYearLabel() {

                var
                    yearFocused = MONTH_FOCUSED.YEAR,
                    yearsInSelector = SETTINGS.yearSelector


                // If there is a need for a years selector
                // then create a dropdown within the valid range
                if ( yearsInSelector ) {

                    // If year selector setting is true, default to 5.
                    // Otherwise divide the years in selector in half
                    // to get half before and half after
                    yearsInSelector = yearsInSelector === true ? 5 : ~~( yearsInSelector / 2 )

                    var
                        // Create a collection to hold the years
                        yearsCollection = [],

                        // The lowest year possible is the difference between
                        // the focused year and the number of years in the selector
                        lowestYear = yearFocused - yearsInSelector,

                        // The first year is the lower of the two numbers:
                        // the lowest year or the minimum year.
                        firstYear = getNumberInRange( lowestYear, DATE_MIN.YEAR ),

                        // The highest year is the sum of the focused year
                        // and the years in selector plus the left over years.
                        highestYear = yearFocused + yearsInSelector + ( firstYear - lowestYear ),

                        // The last year is the higher of the two numbers:
                        // the highest year or the maximum year.
                        lastYear = getNumberInRange( highestYear, DATE_MAX.YEAR, 1 )


                    // In case there are leftover years to put in the selector,
                    // we need to get the lower of the two numbers:
                    // the lowest year minus leftovers, or the minimum year
                    firstYear = getNumberInRange( lowestYear - ( highestYear - lastYear ), DATE_MIN.YEAR )


                    // Add the years to the collection by looping through the range
                    for ( var index = 0; index <= lastYear - firstYear; index += 1 ) {
                        yearsCollection.push( firstYear + index )
                    }


                    // Create the dom string node for a select element
                    return createNode( 'select',

                        // Map through the years collection
                        yearsCollection.map( function( year ) {

                            // Create a dom string node for each option
                            return createNode( 'option',

                                // With the year and no classes
                                year, 0,

                                // Set the value and selected index
                                'value=' + year + ( yearFocused == year ? ' selected' : '' )
                            )
                        }),

                        // The year selector class
                        CLASSES.selectYear,

                        // And some tabindex
                        getTabindexState()
                    )
                }


                // Otherwise just return the year focused
                return createNode( STRING_DIV, yearFocused, CLASSES.year )
            } //createYearLabel


            /**
             * Create the calendar table body
             */
            function createTableBody() {

                var
                    // The loop date object
                    loopDate,

                    // A pseudo index will be the divider between
                    // the previous month and the focused month
                    pseudoIndex,

                    // An array that will hold the classes
                    // and binding for each looped date
                    classAndBinding,

                    // Collection of the dates visible on the calendar
                    // * This gets discarded at the end
                    calendarDates = [],

                    // Weeks visible on the calendar
                    calendarWeeks = '',

                    // Count the number of days in the focused month
                    // by getting the 0-th date of the next month
                    countMonthDays = createDate([ MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH + 1, 0 ]).DATE,

                    // Count the days to shift the start of the month
                    // by getting the day the first of the month falls on
                    // and subtracting 1 to compensate for day 1index
                    // or 2 if "Monday" should be the first day.
                    countShiftby = createDate([ MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH, 1 ]).DAY + ( SETTINGS.firstDay ? -2 : -1 )


                // If the count to shift by is less than the first day
                // of the month, then add a week.
                countShiftby += countShiftby < -1 ? 7 : 0


                // Go through all the days in the calendar
                // and map a calendar date
                for ( var index = 0; index < DAYS_IN_CALENDAR; index += 1 ) {

                    // Get the distance between the index and the count
                    // to shift by. This will serve as the separator
                    // between the previous, current, and next months.
                    pseudoIndex = index - countShiftby


                    // Create a calendar date with a negative or positive pseudoIndex
                    loopDate = createDate([ MONTH_FOCUSED.YEAR, MONTH_FOCUSED.MONTH, pseudoIndex ])


                    // Set the date class and bindings on the looped date.
                    // If the pseudoIndex is greater than zero,
                    // and less or equal to the days in the month,
                    // we need dates from the focused month.
                    classAndBinding = createDateClassAndBinding( loopDate, ( pseudoIndex > 0 && pseudoIndex <= countMonthDays ) )


                    // Create the looped date wrapper,
                    // and then create the table cell wrapper
                    // and finally pass it to the calendar array
                    calendarDates.push( createNode( 'td', createNode( STRING_DIV, loopDate.DATE, classAndBinding[ 0 ], classAndBinding[ 1 ] ) ) )


                    // Check if it's the end of a week.
                    // * We add 1 for 0index compensation
                    if ( ( index % DAYS_IN_WEEK ) + 1 == DAYS_IN_WEEK ) {

                        // Wrap the week and append it into the calendar weeks
                        calendarWeeks += createNode( 'tr', calendarDates.splice( 0, DAYS_IN_WEEK ) )
                    }

                } //endfor



                // Join the dates and wrap the calendar body
                return createNode( 'tbody', calendarWeeks, CLASSES.body )
            } //createTableBody



            /**
             * Create the class and data binding for a looped date node.
             * Returns an array with 2 items:
             * 1) The classes string
             * 2) The data binding string
             */
            function createDateClassAndBinding( loopDate, isMonthFocused ) {

                var
                    // State check for date
                    isDateDisabled,

                    // Create a collection for the classes
                    // with the default classes already included
                    klassCollection = [

                        // The generic day class
                        CLASSES.day,

                        // The class for in or out of focus
                        ( isMonthFocused ? CLASSES.dayInfocus : CLASSES.dayOutfocus )
                    ]


                // If it's less than the minimum date or greater than the maximum date,
                // or if there are dates to disable and this looped date is one of them,
                // flip the "disabled" state to truthy and add the "disabled" class
                if ( loopDate.TIME < DATE_MIN.TIME || loopDate.TIME > DATE_MAX.TIME || ( DATES_TO_DISABLE && DATES_TO_DISABLE.filter( DISABLED_DATES, loopDate ).length ) ) {
                    isDateDisabled = 1
                    klassCollection.push( CLASSES.dayDisabled )
                }


                // If it's today, add the class
                if ( loopDate.TIME == DATE_TODAY.TIME ) {
                    klassCollection.push( CLASSES.dayToday )
                }


                // If it's the highlighted date, add the class
                if ( loopDate.TIME == DATE_HIGHLIGHTED.TIME ) {
                    klassCollection.push( CLASSES.dayHighlighted )
                }


                // If it's the selected date, add the class
                if ( loopDate.TIME == DATE_SELECTED.TIME ) {
                    klassCollection.push( CLASSES.daySelected )
                }


                // Return an array with the classes and data binding
                return [

                    // Return the classes joined
                    // by a single whitespace
                    klassCollection.join( ' ' ),

                    // Create the data binding object
                    // with the value as a string
                    'data-' + ( isDateDisabled ? 'disabled' : 'date' ) + '=' + [
                        loopDate.YEAR,
                        loopDate.MONTH + 1, // add 1 to display an accurate date
                        loopDate.DATE
                    ].join( '/' )
                ]
            } //createDateClassAndBinding


            /**
             * Create the "today" and "clear" buttons
             */
            function createTodayAndClear() {
                return createNode( 'button', SETTINGS.today, CLASSES.buttonToday, 'data-date=' + getDateFormatted( 'yyyy/mm/dd', DATE_TODAY ) + ' ' + getTabindexState() ) + createNode( 'button', SETTINGS.clear, CLASSES.buttonClear, 'data-clear=1 ' + getTabindexState() )
            } //createTodayAndClear


            /**
             * Create the wrapped calendar using the collection
             * of all calendar items and a new table body
             */
            function createCalendarWrapped() {

                // Create a calendar wrapper node
                return createNode( STRING_DIV,

                    // Create a calendar frame
                    createNode( STRING_DIV,

                        // Create a calendar box node
                        createNode( STRING_DIV,

                            // The calendar header
                            createNode( STRING_DIV,

                                // The prev/next month tags
                                // * Truthy argument creates "next" tag
                                createMonthNav() + createMonthNav( 1 ) +

                                // Create the month label
                                createMonthLabel( SETTINGS.showMonthsFull ? SETTINGS.monthsFull : SETTINGS.monthsShort ) +

                                // Create the year label
                                createYearLabel(),

                                // The header class
                                CLASSES.header
                             ) +

                            // The calendar table with table head
                            // and a new calendar table body
                            createNode( 'table', [ TABLE_HEAD, createTableBody() ], CLASSES.table ) +

                            // Create the "today" and "clear" buttons
                            createNode( STRING_DIV, createTodayAndClear(), CLASSES.footer ),

                            // Calendar class
                            CLASSES.calendar
                        ),

                        // Calendar wrap class
                        CLASSES.wrap
                    ),

                    // Calendar frame class
                    CLASSES.frame
                ) //endreturn
            } //calendarWrapped


            /**
             * Get the number that's allowed within an upper or lower limit.
             * * A truthy third argument tests against the upper limit.
             */
            function getNumberInRange( number, limit, upper ) {

                // If we need to test against the upper limit
                // and number is less than the limit,
                // or we need to test against the lower limit
                // and number is more than the limit,
                // return the number. Otherwise return the limit.
                return ( upper && number < limit ) || ( !upper && number > limit ) ? number : limit
            } //getNumberInRange


            /**
             * Return a month by comparing with the date range.
             * If outside the range, returns the "alternate" or "range" value.
             * Otherwise returns the "in range" value or the month itself.
             */
            function getMonthInRange( month, year, alternateValue, inRangeValue ) {

                // If the month is less than the min month,
                // then return the alternate value or min month.
                if ( year <= DATE_MIN.YEAR && month < DATE_MIN.MONTH ) {
                    return alternateValue || DATE_MIN.MONTH
                }

                // If the month is more than the max month,
                // then return the alternate value or max month.
                if ( year >= DATE_MAX.YEAR && month > DATE_MAX.MONTH ) {
                    return alternateValue || DATE_MAX.MONTH
                }

                // Otherwise return the "in range" value or the month itself.
                // * We test `inRangeValue` against null because we need to
                //   test against null and undefined. 0 should be allowed.
                return inRangeValue != null ? inRangeValue : month
            } //getMonthInRange


            /**
             * Get the tabindex based on the calendar open/closed state
             */
            function getTabindexState() {
                return 'tabindex=' + ( CALENDAR.isOpen ? 0 : -1 )
            }


            /**
             * Get any date in any format. Defaults to getting
             * the superficially selected date.
             */
            function getDateFormatted( format, date ) {

                // Otherwise go through the date formats array and
                // convert the format passed into an array to map
                // which we join into a string at the end.
                return DATE_FORMATS.toArray( format || SETTINGS.format ).map( function( value ) {

                    // Trigger the date formats function
                    // or just return value itself.
                    return triggerFunction( DATE_FORMATS[ value ], date || DATE_SELECTED ) || value
                }).join( '' )
            } //getDateFormatted


            /**
             * Set a date as selected or superficially selected
             */
            function setDateSelected( dateTargeted, isSuperficial ) {

                // Set the target as the highlight
                DATE_HIGHLIGHTED = dateTargeted

                // Set the target as the focus
                MONTH_FOCUSED = dateTargeted

                // If it's not just a superficial selection,
                // update the input elements values
                if ( !isSuperficial ) {
                    setElementsValue( dateTargeted )
                }

                // Then render a new calendar
                calendarRender()
            } //setDateSelected


            /**
             * Set the date in the input element and trigger a change event
             */
            function setElementsValue( dateTargeted ) {

                // If there's a date targeted, update the selected date
                DATE_SELECTED = dateTargeted || DATE_SELECTED

                // Set the element value as the formatted date
                // if there was a date targeted. Otherwise clear it.
                // And then broadcast a change event.
                $ELEMENT.val( dateTargeted ? getDateFormatted() : '' ).trigger( 'change' )

                // Trigger the onSelect method within scope of the picker
                triggerFunction( SETTINGS.onSelect, P )
            } //setElementsValue


            /**
             * Find something within the calendar holder
             */
            function $findInHolder( klass ) {
                return $HOLDER.find( '.' + klass )
            } //$findInHolder


            /**
             * Show the month visible on the calendar
             */
            function showMonth( month, year ) {

                // Ensure we have a year to work with
                year = year || MONTH_FOCUSED.YEAR

                // Get the month to be within
                // the minimum and maximum date limits
                month = getMonthInRange( month, year )

                // Set the month to show in focus
                // * We set the date to 1st of the month
                //   because date doesn't matter here
                MONTH_FOCUSED = createDate([ year, month, 1 ])

                // Then render a new calendar
                calendarRender()
            } //showMonth


            /**
             * Toggle the calendar elements as "tab-able" by mapping
             * through the calendar items and updating the tabindex.
             */
            function toggleCalendarElements( tabindex ) {
                CALENDAR.items.map( function( item ) {
                    if ( item ) item.tabIndex = tabindex
                })
            } //toggleCalendarElements


            /**
             * Get an updated collection of calendar items.
             */
            function getUpdatedCalendarItems() {

                return [

                    // The month selector
                    $findInHolder( CLASSES.selectMonth ).on({

                        // *** For iOS ***
                        click: eventPreventPropagation,

                        // Bind the change event
                        change: function() {

                            // Show the month by floating the option selected
                            showMonth( +this.value )

                            // Find the new month selector and focus back on it
                            $findInHolder( CLASSES.selectMonth ).focus()
                        }
                    })[ 0 ],

                    // The year selector
                    $findInHolder( CLASSES.selectYear ).on({

                        // *** For iOS ***
                        click: eventPreventPropagation,

                        // Bind the change event
                        change: function() {

                            // Show the year by floating the option selected and month in focus
                            showMonth( MONTH_FOCUSED.MONTH, +this.value )

                            // Find the new year selector and focus back on it
                            $findInHolder( CLASSES.selectYear ).focus()
                        }
                    })[ 0 ],

                    // The "today" button
                    $findInHolder( CLASSES.buttonToday )[ 0 ],

                    // The "clear" button
                    $findInHolder( CLASSES.buttonClear )[ 0 ]
                ]
            } //getUpdatedCalendarItems


            /**
             * Render a new calendar
             */
            function calendarRender() {

                // Create a new wrapped calendar and place it within the holder
                $HOLDER.html( createCalendarWrapped() )

                // Update the calendar items
                CALENDAR.items = getUpdatedCalendarItems()

                // Trigger the onRender method within scope of the picker
                triggerFunction( SETTINGS.onRender, P )
            } //calendarRender


            /**
             * Prevent an event from propagating further
             */
            function eventPreventPropagation( event ) {
                event.stopPropagation()
            } //eventPreventPropagation


            // Return a new initialized picker
            return new P.init()
        } //Picker





    /**
     * Helper functions
     */

    // Check if a value is a function and trigger it, if that
    function triggerFunction( callback, scope ) {
        if ( typeof callback == 'function' ) {
            return callback.call( scope )
        }
    }

    // Return numbers below 10 with a leading zero
    function leadZero( number ) {
        return ( number < 10 ? '0': '' ) + number
    }

    // Create a dom node string
    function createNode( wrapper, item, klass, attribute ) {

        // If the item is false-y, just return an empty string
        if ( !item ) return ''

        // If the item is an array, do a join
        item = Array.isArray( item ) ? item.join( '' ) : item

        // Check for the class
        klass = klass ? ' class="' + klass + '"' : ''

        // Check for any attributes
        attribute = attribute ? ' ' + attribute : ''

        // Return the wrapped item
        return '<' + wrapper + klass + attribute + '>' + item + '</' + wrapper + '>'
    } //createNode

    // Create a calendar date
    function createDate( datePassed, unlimited ) {

        // If the date passed is an array
        if ( Array.isArray( datePassed ) ) {

            // Create the date
            datePassed = new Date( datePassed[ 0 ], datePassed[ 1 ], datePassed[ 2 ] )
        }

        // If the date passed is a number
        else if ( !isNaN( datePassed ) ) {

            // Create the date
            datePassed = new Date( datePassed )
        }


        // Otherwise if it's not unlimited
        else if ( !unlimited ) {

            // Set the date to today
            datePassed = new Date()

            // Set the time to midnight (for comparison purposes)
            datePassed.setHours( 0, 0, 0, 0 )
        }


        // Return the calendar date object
        return {
            YEAR: unlimited || datePassed.getFullYear(),
            MONTH: unlimited || datePassed.getMonth(),
            DATE: unlimited || datePassed.getDate(),
            DAY: unlimited || datePassed.getDay(),
            TIME: unlimited || datePassed.getTime(),
            OBJ: unlimited || datePassed
        }
    } //createDate




    /**
     * Extend jQuery
     */
    $.fn.pickadate = function( options ) {

        var pickadate = 'pickadate'

        // Merge the options with a deep copy
        options = $.extend( true, {}, $.fn.pickadate.defaults, options )

        // Check if it should be disabled
        // for browsers that natively support `type=date`
        if ( options.disablePicker ) { return this }

        return this.each( function() {
            var $this = $( this )
            if ( this.nodeName == 'INPUT' && !$this.data( pickadate ) ) {
                $this.data( pickadate, new Picker( $this, options ) )
            }
        })
    } //$.fn.pickadate



    /**
     * Default options for the picker
     */
    $.fn.pickadate.defaults = {

        monthsFull: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthsShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],

        weekdaysFull: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekdaysShort: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],

        // Display strings
        monthPrev: '&#9664;',
        monthNext: '&#9654;',
        showMonthsFull: 1,
        showWeekdaysShort: 1,

        // Today and clear
        today: 'Today',
        clear: 'Clear',

        // Date format to show on the input element
        format: 'd mmmm, yyyy',

        // Date format to send to the server
        formatSubmit: 0,

        // Hidden element name suffix
        hiddenSuffix: '_submit',

        // First day of the week: 0 = Sunday, 1 = Monday
        firstDay: 0,

        // Month & year dropdown selectors
        monthSelector: 0,
        yearSelector: 0,

        // Date ranges
        dateMin: 0,
        dateMax: 0,

        // Dates to disable
        datesDisabled: 0,

        // Disable for browsers with native date support
        disablePicker: 0,

        // Events
        onOpen: 0,
        onClose: 0,
        onSelect: 0,
        onStart: 0,
        onRender: 0,


        // Classes
        klass: {

            bodyActive: STRING_PREFIX_DATEPICKER + 'active',

            inputActive: STRING_PREFIX_DATEPICKER + 'input--active',

            holder: STRING_PREFIX_DATEPICKER + 'holder',
            opened: STRING_PREFIX_DATEPICKER + 'holder--opened',
            focused: STRING_PREFIX_DATEPICKER + 'holder--focused',

            frame: STRING_PREFIX_DATEPICKER + 'frame',
            wrap: STRING_PREFIX_DATEPICKER + 'wrap',

            calendar: STRING_PREFIX_DATEPICKER + 'calendar',

            table: STRING_PREFIX_DATEPICKER + 'table',

            header: STRING_PREFIX_DATEPICKER + 'header',

            monthPrev: STRING_PREFIX_DATEPICKER + 'nav--prev',
            monthNext: STRING_PREFIX_DATEPICKER + 'nav--next',

            month: STRING_PREFIX_DATEPICKER + 'month',
            year: STRING_PREFIX_DATEPICKER + 'year',

            selectMonth: STRING_PREFIX_DATEPICKER + 'select--month',
            selectYear: STRING_PREFIX_DATEPICKER + 'select--year',

            weekdays: STRING_PREFIX_DATEPICKER + 'weekday',

            body: STRING_PREFIX_DATEPICKER + 'body',

            day: STRING_PREFIX_DATEPICKER + 'day',
            dayDisabled: STRING_PREFIX_DATEPICKER + 'day--disabled',
            daySelected: STRING_PREFIX_DATEPICKER + 'day--selected',
            dayHighlighted: STRING_PREFIX_DATEPICKER + 'day--highlighted',
            dayToday: STRING_PREFIX_DATEPICKER + 'day--today',
            dayInfocus: STRING_PREFIX_DATEPICKER + 'day--infocus',
            dayOutfocus: STRING_PREFIX_DATEPICKER + 'day--outfocus',

            footer: STRING_PREFIX_DATEPICKER + 'footer',

            buttonClear: STRING_PREFIX_DATEPICKER + 'button--clear',
            buttonToday: STRING_PREFIX_DATEPICKER + 'button--today'
        }
    } //$.fn.pickadate.defaults



})( jQuery, document );







define("jam/pickadate/source/pickadate", function(){});

// plone integration for pickadate.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends: jquery.js patterns.js pickadate.js
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define('js/patterns/datetime',[
  'jquery',
  'js/patterns/base',
  'jam/pickadate/source/pickadate'
], function($, Base) {
  

  var DateTime = Base.extend({
    name: 'datetime',
    defaults: {
      format: "d-mmmm-yyyy@HH:MM",
      formatsubmit: "yyyy-m-d H:M",
      ampm: 'AM,PM',
      minutestep: '5',
      klass: {
        wrapper: "pat-datetime-wrapper",
        icon: "pat-datetime-icon",
        year: "pat-datetime-year",
        month: "pat-datetime-month",
        day: "pat-datetime-day",
        hour: "pat-datetime-hour",
        minute: "pat-datetime-minute",
        ampm: "pat-datetime-ampm",
        delimiter: "pat-datetime-delimiter"
      },
      pickadate: {
        monthSelector: true,
        yearSelector: true
      }
    },
    init: function() {
      var self = this;

      // only initialize on "input" elements
      if (!self.$el.is('input')) {
        return;
      }

      self.pickadateOptions = $.extend(true, {}, $.fn.pickadate.defaults, {
        formatSubmit: 'yyyy-mm-dd',
        onSelect: function(e) {
          var date = this.getDate('yyyy-mm-dd').split('-');
          self.$years.val(parseInt(date[0], 10));
          self.$months.val(parseInt(date[1], 10));
          self.$days.val(parseInt(date[2], 10));
          self.setDate(
            self.$years.val(),
            self.$months.val(),
            self.$days.val(),
            self.$hours.val(),
            self.$minutes.val(),
            self.$ampm.val()
          );
        }
      }, self.options.pickadate);

      self.$el.hide();

      self.$wrapper = $('<div/>')
        .addClass(self.options.klass.wrapper)
        .insertAfter(self.$el);

      self.pickadate = $('<input/>')
        .hide().appendTo(self.$wrapper)
        .pickadate(self.pickadateOptions).data('pickadate');

      function changePickadateDate() {
        if (self.$years.val() !== '' &&
            self.$months.val() !== '' &&
            self.$days.val() !== '') {
          self.pickadate.setDate(
              parseInt(self.$years.val(), 10),
              parseInt(self.$months.val(), 10),
              parseInt(self.$days.val(), 10),
              true);
        }
        self.setDate(
          self.$years.val(),
          self.$months.val(),
          self.$days.val(),
          self.$hours.val(),
          self.$minutes.val(),
          self.$ampm.val()
        );
      }

      self.$years = $('<select/>')
        .addClass(self.options.klass.year)
        .on('change', changePickadateDate);
      self.$months = $('<select/>')
        .addClass(self.options.klass.month)
        .on('change', changePickadateDate);
      self.$days = $('<select/>')
        .addClass(self.options.klass.day)
        .on('change', changePickadateDate);
      self.$hours = $('<select/>')
        .addClass(self.options.klass.hour)
        .on('change', changePickadateDate);
      self.$minutes = $('<select/>')
        .addClass(self.options.klass.minute)
        .on('change', changePickadateDate);
      self.$icon = $('<span class="' + self.options.klass.icon + '"/>')
        .on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          self.toggle();
        });

      // append elements in correct order according to self.options.format
      $.each(self._strftime(self.options.format,
        function(format) {
          switch (format) {
            case 'yy':
            case 'yyyy':
              return self.$years.append(self._getYears(format));
            case 'm':
            case 'mm':
            case 'mmm':
            case 'mmmm':
              return self.$months.append(self._getMonths(format));
            case 'd':
            case 'dd':
            case 'ddd':
            case 'dddd':
              return self.$days.append(self._getDays(format));
            case 'H':
            case 'HH':
              return self.$hours.append(self._getHours(format));
            case 'M':
            case 'MM':
              return self.$minutes.append(self._getMinutes(format));
            case '@':
              return self.$icon;
            default:
              return $('<span> ' + format + ' </span>')
                .addClass(self.options.klass.delimiter);
          }
        }
      ), function(i, $item) {
        self.$wrapper.append($item);
      });

      if (self.options.ampm) {
        self.$ampm = $('<select/>')
          .addClass(self.options.klass.ampm)
          .append(self._getAMPM())
          .on('change', changePickadateDate);
        self.$wrapper.append($('<span> </span>'));
        self.$wrapper.append(self.$ampm);
      }

      // populate dropdowns and calendar
      // TODO: should be done with self._strtime
      if (self.$el.val() !== '') {
        var tmp = self.$el.val().split(' '),
            date = tmp[0].split('-'),
            time = tmp[1].split(':'),
            ampm = (parseInt(time[0], 10) >= 12) && 'PM' || 'AM';
        time[0] -= (parseInt(time[0], 10) >= 12) && 12 || 0;
        self.setDate(
            date[0], date[1], date[2],
            time[0], time[1], ampm
            );
        self.$years.val('' + parseInt(date[0], 10));
        self.$months.val('' + parseInt(date[1], 10));
        self.$days.val('' + parseInt(date[2], 10));
        self.$hours.val('' + parseInt(time[0], 10));
        self.$minutes.val('' + parseInt(time[1], 10));
        if (self.options.ampm) {
          self.$ampm.val(ampm);
        }
      }
    },
    _strftime: function(format, action, options) {
      var self = this, result = [];
      // Rule   | Result                    | Example
      // -------+---------------------------+--------------
      // yy     | Year - short              | 00-99
      // yyyy   | Year - full               | 2000-2999
      // m      | Month                     | 1-12
      // mm     | Month with leading zero   | 01-12
      // mmm    | Month name - short        | Jan-Dec
      // mmmm   | Month name - full         | January-December
      // d      | Day                       | 1-31
      // dd     | Date with leading zero    | 01-31
      // ddd    | Weekday - short           | Sun-Sat
      // dddd   | Weekday - full            | Sunday-Saturday
      // H      | Hour                      | 0-23
      // HH     | Hour with leading zero    | 00-23
      // M      | Minute                    | 0-59
      // MM     | Minute with leading zero  | 00-59
      // @      | Calendar icon
      options = options || [
        'dddd', 'ddd', 'dd', 'd',
        'mmmm', 'mmm', 'mm', 'm',
        'yyyy', 'yy',
        'HH', 'H',
        'MM', 'M',
        '@'];
      $.each(options, function(i, itemFormat) {
        if (format.indexOf(itemFormat) !== -1) {
          var temp = format.split(itemFormat), new_result;
          if (options.length > 0 && temp[0] !== '') {
            new_result = result.concat(self._strftime(temp[0], action, options.slice(i)));
            if (new_result.length === result.length) {
              result.push(action(temp[0]));
            } else {
              result = new_result;
            }
          }
          result.push(action(itemFormat));
          if (options.length > 0 && temp[1] !== '') {
            new_result = result.concat(self._strftime(temp[1], action, options.slice(i)));
            if (new_result.length === result.length) {
              result.push(action(temp[1]));
            } else {
              result = new_result;
            }
          }
          return false;
        }
        if (options.length === 0) {
          return false;
        }
      });
      return result;
    },
    _getYears: function(format) {
      var years = [],
          current = this.getDate('yyyy'),
          _current = current,
          min,
          max;
      if (!current) {
        current = (new Date()).getFullYear();
        min = current - 10;
        max = current + 10;
      } else {
        min = this.pickadate.getdatelimit('yyyy'),
        max = this.pickadate.getDateLimit(true, 'yyyy');
      }
      years.push(this._createOption('', '--', _current === undefined));
      while (min <= max) {
        if (format === 'yy') {
          years.push(this._createOption(min, ('' + min).slice(-2), min === _current));
        } else {
          years.push(this._createOption(min, min, min === _current));
        }
        min += 1;
      }
      return years;
    },
    _getMonths: function(format) {
      var months = [],
          current = this.getDate('m'),
          month = 1;
      months.push(this._createOption('', '--', current === undefined));
      while (month <= 12) {
        if (format === 'm') {
          months.push(this._createOption(month, month, current === month));
        } else if (format === 'mm') {
          months.push(this._createOption(month,
              ('0' + month).slice(-2), current === month));
        } else if (format === 'mmm') {
          months.push(this._createOption(month,
              this.pickadateOptions.monthsShort[month - 1], current === month));
        } else {
          months.push(this._createOption(month,
              this.pickadateOptions.monthsFull[month - 1], current === month));
        }
        month += 1;
      }
      return months;
    },
    _getDays: function(format) {
      var days = [],
          current = this.getDate('d'),
          currentMonth = this.getDate('m'),
          maxDays = 31,
          day = 1;
      days.push(this._createOption('', '--', current === undefined));
      if (currentMonth) {
        if ($.inArray(currentMonth, [4, 6, 9, 11])) {
          maxDays = 30;
        } else if ($.inArray(currentMonth, [2])) {
          maxDays = 29;
        }
      }
      while (day <= maxDays) {
        if (format === 'd') {
          days.push(this._createOption(day, day, current === day));
        // formating of weekdays doesn't make sense in this case
        } else {
          days.push(this._createOption(day, ('0' + day).slice(-2), current === day));
        }
        day += 1;
      }
      return days;
    },
    _getAMPM: function() {
      var AMPM = this.options.ampm.split(',');
      return [
        this._createOption(AMPM[0], AMPM[0]),
        this._createOption(AMPM[1], AMPM[1])
        ];
    },
    _getHours: function(format) {
      var hours = [],
          current = this.getDate('h'),
          hour = 0;
      hours.push(this._createOption('', '--', current === undefined));
      while (hour < (this.options.ampm && 12 || 24)) {
        if (format === 'H') {
          hours.push(this._createOption(hour, hour, current === hour));
        } else {
          hours.push(this._createOption(hour, ('0' + hour).slice(-2), current === hour));
        }
        hour += 1;
      }
      return hours;
    },
    _getMinutes: function(format) {
      var minutes = [],
          current = this.getDate('m'),
          minute = 0;
      minutes.push(this._createOption('', '--', current === undefined));
      while (minute < 60) {
        if (format === 'M') {
          minutes.push(this._createOption(minute, minute, current === minute));
        } else {
          minutes.push(this._createOption(minute, ('0' + minute).slice(-2),
                current === minute));
        }
        minute += parseInt(this.options.minutestep, 10);
      }
      return minutes;
    },
    _createOption: function(token, title, selected) {
      var $el = $('<option/>').attr('value', token).html(title);
      if (selected) {
        $el.attr('selected', 'selected');
      }
      return $el;
    },
    setDate: function(year, month, day, hour, minutes, ampm) {
      var self = this;
      self._rawDate = undefined;
      self.$el.attr('value', '');
      if (year !== '' &&
          month !== '' &&
          day !== '' &&
          hour !== '' &&
          minutes !== '') {
        self._rawDate = new Date(
          parseInt(year, 10),
          parseInt(month, 10),
          parseInt(day, 10),
          parseInt(hour, 10) + (ampm === 'PM' && 12 || 0),
          parseInt(minutes, 10)
          );
        self.$el.attr('value', self.getDate(self.options.formatsubmit));
      }
    },
    getDate: function(format) {
      var self = this;
      if (!self._rawDate) { return; }
      if (format) {
        return self._strftime(format, function(format) {
          switch (format) {
            case 'yy':
              return ('' + self._rawDate.getFullYear()).slice(-2);
            case 'yyyy':
              return '' + self._rawDate.getFullYear();
            case 'm':
              return '' + self._rawDate.getMonth();
            case 'mm':
              return ('0' + self._rawDate.getMonth()).slice(-2);
            case 'mmm':
              return self.pickadateOptions.monthsShort[self._rawDate.getMonth()];
            case 'mmmm':
              return self.pickadateOptions.monthsFull[self._rawDate.getMonth()];
            case 'd':
              return '' + self._rawDate.getDate();
            case 'dd':
              return ('0' + self._rawDate.getDate()).slice(-2);
            case 'ddd':
              return self.pickadateOptions.weekdaysShort[self._rawDate.getDay()];
            case 'dddd':
              return self.pickadateOptions.weekdaysFull[self._rawDate.getDay()];
            case 'H':
              return '' + self._rawDate.getHours();
            case 'HH':
              return ('0' + self._rawDate.getHours()).slice(-2);
            case 'M':
              return '' + self._rawDate.getMinutes();
            case 'MM':
              return ('0' + self._rawDate.getMinutes()).slice(-2);
            default:
              return format;
          }
        }).join('');
      }
      return self._rawDate;
    },
    toggle: function() {
      if (this.pickadate.isOpen()) {
        this.close();
      } else {
        this.open();
      }
    },
    open: function() {
      if (!this.pickadate.isOpen()) {
        this.trigger('open');
        this.pickadate.open();
        this.trigger('opened');
      }
    },
    close: function() {
      if (this.pickadate.isOpen()) {
        this.trigger('close');
        this.pickadate.close();
        this.trigger('closed');
      }
    }
  });

  return DateTime;

});

// Pattern which generates Table Of Contents.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define('js/patterns/autotoc',[
  'jquery',
  'js/patterns/base'
], function($, Base, Parser) {
  

  var AutoTOC = Base.extend({
    name: "autotoc",
    defaults: {
      section: 'section',
      levels: 'h1,h2,h3',
      IDPrefix: 'autotoc-item-',
      klassTOC: 'autotoc-nav',
      klassSection: 'autotoc-section',
      klassLevelPrefix: 'autotoc-level-',
      klassActive: 'active',
      scrollDuration: 'slow',
      scrollEasing: 'swing'
    },
    init: function() {
      var self = this;
      self.$toc = $('<nav/>')
          .prependTo(self.$el)
          .addClass(self.options.klassTOC);

      if (self.options.klass) {
        self.$el.addClass(self.options.klass);
      }

      $(self.options.section, self.$el).addClass(self.options.klassSection);

      $(self.options.levels, self.$el).each(function(i) {
        var $level = $(this),
            id = $level.prop('id') ? '#' + $level.prop('id') :
                 $level.parents(self.options.section).prop('id');
        if (!id) {
          id = self.options.IDPrefix + self.name + '-' + i;
          $level.prop('id', id);
        }
        $('<a/>')
          .appendTo(self.$toc)
          .text($level.text())
          .prop('href', id)
          .addClass(self.options.klassLevelPrefix + self.getLevel($level))
          .on('click', function(e, doScroll) {
            e.stopPropagation();
            e.preventDefault();
            $('.' + self.options.klassActive, self.$el)
                .removeClass(self.options.klassActive);
            $(e.target).addClass(self.options.klassActive);
            $level.parents(self.options.section)
                .addClass(self.options.klassActive);
            if (doScroll !== false && self.options.scrollDuration && $level) {
              $('body,html').animate({
                scrollTop: $level.offset().top
              }, self.options.scrollDuration, self.options.scrollEasing);
            }
            if (self.$el.parents('.modal').size() !== 0) {
              self.$el.trigger('resize.modal.patterns');
            }
          });
      });

      self.$toc.find('a').first().trigger('click', false);

    },
    getLevel: function($el) {
      var elementLevel = 0;
      $.each(this.options.levels.split(','), function(level, levelSelector) {
        if ($el.filter(levelSelector).size() === 1) {
          elementLevel = level + 1;
          return false;
        }
      });
      return elementLevel;
    }
  });

  return AutoTOC;

});

// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Description:
// 
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */

if (window.jQuery) {
  define( "jquery", [], function () {
    
    return window.jQuery;
  } );
}

define('js/bundles/widgets',[
  'jquery',
  'jam/Patterns/src/registry',
  'js/patterns/select2',
  'js/patterns/datetime',
  'js/patterns/autotoc'
], function($, registry) {
  

  // BBB: we need to hook pattern to classes which plone was using until now
  var Widgets = {
    name: "plone-widgets",
    transform: function($root) {

      // apply autotoc pattern where enableFormTabbing exists
      var $match = $root.filter('.enableFormTabbing');
      $match = $match.add($root.find('.enableFormTabbing'));
      $match.addClass('pat-autotoc');
      $match.attr({
        'data-autotoc-levels': 'legend',
        'data-autotoc-section': 'fieldset',
        'data-autotoc-klass': 'autotabs'
      });

    },
    scan: function(selector) {
      registry.scan($(selector));
    }
  };

  registry.register(Widgets);

  return Widgets;
});

// expose pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */
define('js/patterns/backdrop',[
  'jquery',
  'js/patterns/base'
], function($, Base, Parser) {
  

  var Backdrop = Base.extend({
    name: "backdrop",
    defaults: {
      zIndex: "1000",
      opacity: "0.8",
      klass: "backdrop",
      klassActive: 'backdrop-active',
      closeOnEsc: true,
      closeOnClick: true
    },
    init: function() {
      var self = this;
      self.$backdrop = $('> .' + self.options.klass, self.$el);
      if (self.$backdrop.size() === 0) {
        self.$backdrop= $('<div/>')
            .hide()
            .appendTo(self.$el)
            .addClass(self.options.klass);
      }
      if (self.options.closeOnEsc === true) {
        $(document).on('keydown', function(e, data) {
          if (self.$el.is('.' + self.options.klassActive)) {
            if (e.keyCode === 27) {  // ESC key pressed
              self.hide();
            }
          }
        });
      }
      if (self.options.closeOnClick === true) {
        self.$backdrop.on('click', function() {
          if (self.$el.is('.' + self.options.klassActive)) {
            self.hide();
          }
        });
      }
    },
    show: function() {
      var self = this;
      if (!self.$el.hasClass(self.options.klassActive)) {
        self.trigger('show');
        self.$backdrop.css('opacity', '0').show();
        self.$el.addClass(self.options.klassActive);
        self.$backdrop.animate({ opacity: self.options.opacity }, 500);
        self.trigger('shown');
      }
    },
    hide: function() {
      var self = this;
      if (self.$el.hasClass(self.options.klassActive)) {
        self.trigger('hide');
        self.$backdrop.animate({ opacity: '0' }, 500).hide();
        self.$el.removeClass(self.options.klassActive);
        self.trigger('hidden');
      }
    }
  });

  return Backdrop;

});

// expose pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */
define('js/patterns/expose',[
  'jquery',
  'js/patterns/base',
  'js/patterns/backdrop'
], function($, Base, Backdrop) {
  

  var Expose = Base.extend({
    name: "expose",
    defaults: {
      triggers: "focusin",
      klassActive: "active",
      backdrop: "body",
      backdropZIndex: "1000",
      backdropOpacity: "0.8",
      backdropKlass: "backdrop",
      backdropKlassActive: 'backdrop-active',
      backdropCloseOnEsc: true,
      backdropCloseOnClick: true
    },
    init: function() {
      var self = this;

      self.backdrop = new Backdrop(self.$el.parents(self.options.backdrop), {
        zindex: self.options.backdropZIndex,
        klass: self.options.backdropKlass,
        klassActive: self.options.backdropKlassActive,
        styles: self.options.backdropStyles,
        opacity: self.options.backdropOpacity,
        closeOnEsc: self.options.backdropCloseOnEsc,
        closeOnClick: self.options.backdropCloseOnClick
      });
      if (self.options.triggers) {
        $.each(self.options.triggers.split(','), function(i, item) {
          item = item.split(' ');
          $(item[1] || self.$el).on(item[0], function() {
            self.show();
          });
        });
      }
      self.backdrop.on('hidden', function() { self.hide(); });
    },
    show: function() {
      var self = this;
      if (!self.$el.hasClass(self.options.klassActive)) {
        self.trigger('show');
        self.$el.addClass(self.options.klassActive);
        self.backdrop.show();
        self._initialZIndex = self.$el.css('z-index');
        self.$el.css('z-index', parseInt(self.options.backdropZIndex, 10) + 1);
        self.$el.css('opacity', '0');
        self.$el.animate({ opacity: '1' }, 500);
        self.trigger('shown');
      }
    },
    hide: function() {
      var self = this;
      if (self.$el.hasClass(self.options.klassActive)) {
        self.trigger('hide');
        self.backdrop.hide();
        self.$el.css('z-index', self._initialZIndex);
        self.$el.removeClass(self.options.klassActive);
        self.trigger('hidden');
      }
    }
  });

  return Expose;

});

// modal pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends: jquery.js patterns.js pickadate.js
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */
define('js/patterns/modal',[
  'jquery',
  'js/patterns/base',
  'js/patterns/backdrop',
  'jam/Patterns/src/registry'
], function($, Base, Backdrop, registry, undefined) {
  

  var Modal = Base.extend({
    name: "modal",
    jqueryPlugin: "modal",
    defaults: {
      triggers: '',
      position: "center middle",
      width: "",
      height: "",
      margin: "20px",
      klass: "modal",
      klassWrapper: "modal-wrapper",
      klassWrapperInner: "modal-wrapper-inner",
      klassLoading: "modal-loading",
      klassActive: "active",
      backdrop: "body",
      backdropZIndex: "1000",
      backdropOpacity: "0.8",
      backdropKlass: "backdrop",
      backdropKlassActive: "backdrop-active",
      backdropCloseOnEsc: true,
      backdropCloseOnClick: true
    },
    init: function() {
      var self = this;


      self.backdrop = new Backdrop(self.$el.parents(self.options.backdrop), {
        zindex: self.options.backdropZIndex,
        klass: self.options.backdropKlass,
        klassActive: self.options.backdropKlassActive,
        styles: self.options.backdropStyles,
        opacity: self.options.backdropOpacity,
        closeOnEsc: self.options.backdropCloseOnEsc,
        closeOnClick: self.options.backdropCloseOnClick
      });
      self.backdrop.on('hidden', function(e) {
        self.hide();
      });

      self.$wrapper = $('> .' + self.options.klassWrapper, self.backdrop.$el);
      if (self.$wrapper.size() === 0) {
        self.$wrapper = $('<div/>')
          .hide()
          .css({
            'z-index': parseInt(self.options.backdropZIndex, 10) + 1,
            'overflow-y': 'auto',
            'position': 'fixed',
            'height': '100%',
            'width': '100%',
            'bottom': '0',
            'left': '0',
            'right': '0',
            'top': '0'
          })
          .addClass(self.options.klassWrapper)
          .insertBefore(self.backdrop.$backdrop)
          .on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.backdrop.hide();
          });
      }

      self.$wrapperInner = $('> .' + self.options.klassWrapperInner, self.$wrapper);
      if (self.$wrapperInner.size() === 0) {
        self.$wrapperInner = $('<div/>')
          .addClass(self.options.klassWrapperInner)
          .css({
            'position': 'absolute',
            'bottom': '0',
            'left': '0',
            'right': '0',
            'top': '0'
          })
          .appendTo(self.$wrapper);
      }

      self.$loading = $('> .' + self.options.klassLoading, self.$wrapperInner);
      if (self.$loading.size() === 0) {
        self.$loading = $('<div/>').hide()
          .addClass(self.options.klassLoading)
          .appendTo(self.$wrapperInner);
      }
      $(window.parent).resize(function() {
        self.positionModal();
      });

      if (self.options.triggers) {
        $.each(self.options.triggers, function(i, item) {
          item = item.split(' ');
          $(item[1] || self.$el).on(item[0], function() {
            self.show();
          });
        });
      }

      if (self.$el.is('a')) {
        if (self.$el.attr('href')) {
          if (!self.options.target && self.$el.attr('href').substr(0, 1) === '#') {
            self.options.target = self.$el.attr('href');
          }
          if (!self.options.ajaxUrl && self.$el.attr('href').substr(0, 1) !== '#') {
            self.options.ajaxUrl = self.$el.attr('href');
          }
        }
        self.$el.on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          self.show();
        });
      }

      self.initModal();
      self.$wrapper.on('hidden', function(e) {
        e.stopPropagation();
        e.preventDefault();
        self.hide();
      });
    },
    initModalElement: function($modal) {
      var self = this;
      $modal
        .addClass(self.options.klass)
        .on('click', function(e) {
          e.stopPropagation();
          if ($.nodeName(e.target, 'a')) {
            e.preventDefault();
            // TODO: open links inside modal
          }
        })
        .on('destroy.modal.patterns', function(e) {
          e.stopPropagation();
          self.hide();
        })
        .on('resize.modal.patterns', function(e) {
          e.stopPropagation();
          e.preventDefault();
          self.positionModal(true);
        });
      $modal.data('pattern-' + self.name, self);
      return $modal;
    },
    initModal: function() {
      var self = this;
      if (self.options.ajaxUrl) {
        self.$modal = function() {
          self.trigger('before-ajax');
          self.$wrapper.parent().css('overflow', 'hidden');
          self.$wrapper.show();
          self.backdrop.show();
          self.$loading.show();
          self.positionLoading();
          self.ajaxXHR = $.ajax({
              url: self.options.ajaxUrl,
              type: self.options.ajaxType
          }).done(function(response, textStatus, xhr) {
            self.ajaxXHR = undefined;
            self.$loading.hide();
            self.$modal = self.initModalElement(
              $($((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
                .replace('<body', '<div').replace('</body>', '</div>'))[0]))
              .appendTo(self.$wrapperInner);
            self.trigger('after-ajax', self, textStatus, xhr);
            self.show();
          });
        };
      } else if (self.options.target) {
        self.$modal = function() {
          self.$modal = self.initModalElement($('<div/>'))
              .html($(self.options.target).clone())
              .appendTo(self.$wrapperInner);
          self.show();
        };
      } else {
        self.$modal = self.initModalElement($('<div/>'))
              .html(self.$el.clone())
              .appendTo(self.$wrapperInner);
      }

    },
    positionLoading: function() {
      var self = this;
      self.$loading.css({
        'margin-left': self.$wrapper.width()/2 - self.$loading.width()/2,
        'margin-top': self.$wrapper.height()/2 - self.$loading.height()/2,
        'position': 'absolute',
        'bottom': '0',
        'left': '0',
        'right': '0',
        'top': '0'
      });
    },
    positionModal: function(preserve_top) {
      var self = this;
      if (typeof self.$modal !== 'function') {

        if (preserve_top) {
          preserve_top = self.$modal.css('top');
        }

        self.$modal.removeAttr('style');
        // if backdrop wrapper is set on body then wrapper should have height
        // of window so we can do scrolling of inner wrapper
        self.$wrapperInner.css({
          'height': '100%',
          'width': '100%'
        });
        if (self.$wrapper.parent().is('body')) {
          self.$wrapper.height($(window.parent).height());
        }

        // place modal at top left with desired width/height and margin
        self.$modal.css({
          'padding': '0',
          'margin': '0',
          'width': self.options.width,
          'height': self.options.height,
          'position': 'absolute',
          'top': preserve_top ? preserve_top : '0',
          'left': '0'
        });

        self.$modal.css({'margin': '0'});
        var modalOffsetBefore = self.$modal.offset();
        self.$modal.css({ 'margin': self.options.margin });
        var modalOffset = self.$modal.offset(),
            modalOuterWidth = self.$modal.outerWidth(true),
            modalInnerWidth = self.$modal.innerWidth(),
            modalOuterHeight = self.$modal.outerHeight(true),
            modalInnerHeight = self.$modal.innerHeight();
        self.$modal.css({ 'margin': '0' });

        var topMargin = modalOffset.top - modalOffsetBefore.top,
            bottomMargin = modalOuterHeight - modalInnerHeight - topMargin,
            leftMargin = modalOffset.left - modalOffsetBefore.left,
            rightMargin = modalOuterWidth - modalInnerWidth - leftMargin;

        // place modal in right position
        var positionHorizontal = self.options.position.split(' ')[0],
            positionVertical = self.options.position.split(' ')[1],
            positionTop, positionBottom, positionLeft, positionRight;

        if (positionHorizontal === 'left') {
          positionLeft = leftMargin + 'px';
          if (self.$wrapperInner.width() < self.$modal.width()) {
            positionRight = rightMargin + 'px';
          } else {
            positionRight = 'auto';
          }
        } else if (positionHorizontal === 'bottom') {
          positionRight = leftMargin + 'px';
          if (self.$wrapperInner.width() < self.$modal.width()) {
            positionLeft = leftMargin + 'px';
          } else {
            positionLeft = 'auto';
          }
        } else {
          if (self.$wrapperInner.width() < self.$modal.width() + leftMargin + rightMargin) {
            positionLeft = leftMargin + 'px';
            positionRight = rightMargin + 'px';
          } else {
            positionLeft = (self.$wrapperInner.innerWidth()/2 -
                self.$modal.outerWidth()/2 - leftMargin) + 'px';
            positionRight = (self.$wrapperInner.innerWidth()/2 -
                self.$modal.outerWidth()/2 - rightMargin) + 'px';
          }
        }
        self.$modal.css({
          'left': positionLeft,
          'right': positionRight,
          'width': self.$modal.width()
        });

        // if modal is bigger then wrapperInner then resize wrapperInner to
        // match modal height
        if (self.$wrapperInner.height() < self.$modal.height()) {
          self.$wrapperInner.height(self.$modal.height() + topMargin + bottomMargin);
        }

        if (preserve_top || positionVertical === 'top') {
          positionTop = topMargin + 'px';
          if (self.$wrapperInner.height() < self.$modal.height()) {
            positionBottom = bottomMargin + 'px';
          } else {
            positionBottom = 'auto';
          }
        } else if (positionVertical === 'bottom') {
          positionBottom = bottomMargin + 'px';
          if (self.$wrapperInner.height() < self.$modal.height()) {
            positionTop = topMargin + 'px';
          } else {
            positionTop= 'auto';
          }
        } else {
          if (self.$wrapperInner.height() < self.$modal.height()) {
            positionTop = topMargin + 'px';
            positionBottom = bottomMargin + 'px';
          } else {
            positionTop = positionBottom = (self.$wrapperInner.height()/2 -
                self.$modal.height()/2) + 'px';
          }
        }
        self.$modal.css({
          'top': positionTop,
          'bottom': positionBottom
        });

      }
    },
    show: function() {
      var self = this;
      if (!self.$el.hasClass(self.options.klassActive)) {
        if (typeof self.$modal === 'function') {
          self._$modal = self.$modal;
          self.$modal();
        } else {
          self.trigger('show');
          self.backdrop.show();
          self.$wrapper.show();
          self.$wrapper.parent().css('overflow', 'hidden');
          self.$el.addClass(self.options.klassActive);
          self.$modal.addClass(self.options.klassActive);
          registry.scan(self.$modal);
          self.positionModal();
          $('img', self.$modal).load(function() {
            self.positionModal();
          });
          $(window.parent).on('resize.modal.patterns', function() {
            self.positionModal();
          });
          self.trigger('shown');
        }
      }
    },
    hide: function() {
      var self = this;
      if (self.ajaxXHR) {
        self.ajaxXHR.abort();
      }
      if (self.$el.hasClass(self.options.klassActive)) {
        self.trigger('hide');
        self.backdrop.hide();
        self.$wrapper.hide();
        self.$wrapper.parent().css('overflow', 'visible');
        self.$el.removeClass(self.options.klassActive);
        if (self.$modal.remove) {
          self.$modal.remove();
          self.initModal();
        }
        $(window.parent).off('resize.modal.patterns');
        self.trigger('hidden');
      }
    }
  });

  return Modal;

});

// Pattern which provide some basic form helpers:
// - prevent forms to be submitted twice w/out warning
// This is going to replace 'Products/CMFPlone/skins/plone_ecmascript/formsubmithelpers.js'
//
// Author: Simone Orsi
// Contact: simahawk@gmail.com
// Version: 1.0
//
// License:
//
// Copyright (C) 2013 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define('js/patterns/preventdoublesubmit',[
  'jquery',
  'js/patterns/base'
], function($, Base, Parser) {
  

  var PreventDoubleSubmit = Base.extend({
    name: "preventdoublesubmit",
    defaults: {
      message : 'You already clicked the submit button. ' +
                'Do you really want to submit this form again?',
      guardKlass: 'submitting',
      optOutKlass: 'allowMultiSubmit',
      changedKlass: 'changed'
    },
    init: function() {
      var self = this;
      // if this is not a form just return
      if(!self.$el.is('form')){ return; }

      $(':submit', self.$el).click(function(){
        // mark the button as clicked
        $(':submit').removeAttr('clicked');
        $(this).attr('clicked', 'clicked');
        // if submitting and no opt-out klass is found
        // pop up confirmation dialog
        if ($(this).hasClass(self.options.guardKlass) &&
              !$(this).hasClass(self.options.optOutKlass)){
          return self._confirm();
        }
        $(this).addClass(self.options.guardKlass);
      });

    },

    _confirm: function(){
      return window.confirm(this.options.message);
    }

  });

  return PreventDoubleSubmit;

});

// Pattern which provide some basic form helpers:
// - prevent forms with changed values to be unloaded 
// This is going to replace 'Products/CMFPlone/skins/plone_ecmascript/formUnload.js'
// Bits of this come from 
// https://raw.github.com/mmonteleone/jquery.safetynet/master/jquery.safetynet.js
//
// Author: Simone Orsi
// Contact: simahawk@gmail.com
// Version: 1.0
//
// License:
//
// Copyright (C) 2013 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define('js/patterns/formUnloadAlert',[
  'jquery',
  'js/patterns/base'
], function ($, Base, Parser) {
  

  var FormUnloadAlert = Base.extend({
    name: "formunloadalert",
    _changed : false,       // Stores a listing of raised changes by their key
    _suppressed : false,     // whether or not warning should be suppressed
    defaults: {
      message :  "Discard changes? If you click OK, " +
                 "any changes you have made will be lost.",
      // events on which to check for changes
      changingEvents: 'change keyup paste',
      // fields on which to check for changes
      changingFields: 'input,select,textarea,fileupload'
    },
    init: function () {
      var self = this;
      // if this is not a form just return
      if (!self.$el.is('form')) { return; }

      $(self.options.changingFields, self.$el).on(
        self.options.changingEvents,
        function (evt) {
          self._changed = true;
        }
      );

      $(window).on('beforeunload', function(e){
        return self._handle_unload(self, e);
      });

      self.$el.on('submit', self.suppress);

    },

    _handle_unload : function (self, e) {
      if (self._suppressed) {
        self._suppressed = false;
        return undefined;
      }
      if (self._changed) {
        var msg = self.options.message;
        (e || window.event).returnValue = msg;
        return msg;
      }
    },

    suppress: function () {
        this._suppressed = true;
    }

  });
  return FormUnloadAlert;

});

// XRegExp 1.5.1
// (c) 2007-2012 Steven Levithan
// MIT License
// <http://xregexp.com>
// Provides an augmented, extensible, cross-browser implementation of regular expressions,
// including support for additional syntax, flags, and methods

var XRegExp;

if (XRegExp) {
    // Avoid running twice, since that would break references to native globals
    throw Error("can't load XRegExp twice in the same frame");
}

// Run within an anonymous function to protect variables and avoid new globals
(function (undefined) {

    //---------------------------------
    //  Constructor
    //---------------------------------

    // Accepts a pattern and flags; returns a new, extended `RegExp` object. Differs from a native
    // regular expression in that additional syntax and flags are supported and cross-browser
    // syntax inconsistencies are ameliorated. `XRegExp(/regex/)` clones an existing regex and
    // converts to type XRegExp
    XRegExp = function (pattern, flags) {
        var output = [],
            currScope = XRegExp.OUTSIDE_CLASS,
            pos = 0,
            context, tokenResult, match, chr, regex;

        if (XRegExp.isRegExp(pattern)) {
            if (flags !== undefined)
                throw TypeError("can't supply flags when constructing one RegExp from another");
            return clone(pattern);
        }
        // Tokens become part of the regex construction process, so protect against infinite
        // recursion when an XRegExp is constructed within a token handler or trigger
        if (isInsideConstructor)
            throw Error("can't call the XRegExp constructor within token definition functions");

        flags = flags || "";
        context = { // `this` object for custom tokens
            hasNamedCapture: false,
            captureNames: [],
            hasFlag: function (flag) {return flags.indexOf(flag) > -1;},
            setFlag: function (flag) {flags += flag;}
        };

        while (pos < pattern.length) {
            // Check for custom tokens at the current position
            tokenResult = runTokens(pattern, pos, currScope, context);

            if (tokenResult) {
                output.push(tokenResult.output);
                pos += (tokenResult.match[0].length || 1);
            } else {
                // Check for native multicharacter metasequences (excluding character classes) at
                // the current position
                if (match = nativ.exec.call(nativeTokens[currScope], pattern.slice(pos))) {
                    output.push(match[0]);
                    pos += match[0].length;
                } else {
                    chr = pattern.charAt(pos);
                    if (chr === "[")
                        currScope = XRegExp.INSIDE_CLASS;
                    else if (chr === "]")
                        currScope = XRegExp.OUTSIDE_CLASS;
                    // Advance position one character
                    output.push(chr);
                    pos++;
                }
            }
        }

        regex = RegExp(output.join(""), nativ.replace.call(flags, flagClip, ""));
        regex._xregexp = {
            source: pattern,
            captureNames: context.hasNamedCapture ? context.captureNames : null
        };
        return regex;
    };


    //---------------------------------
    //  Public properties
    //---------------------------------

    XRegExp.version = "1.5.1";

    // Token scope bitflags
    XRegExp.INSIDE_CLASS = 1;
    XRegExp.OUTSIDE_CLASS = 2;


    //---------------------------------
    //  Private variables
    //---------------------------------

    var replacementToken = /\$(?:(\d\d?|[$&`'])|{([$\w]+)})/g,
        flagClip = /[^gimy]+|([\s\S])(?=[\s\S]*\1)/g, // Nonnative and duplicate flags
        quantifier = /^(?:[?*+]|{\d+(?:,\d*)?})\??/,
        isInsideConstructor = false,
        tokens = [],
        // Copy native globals for reference ("native" is an ES3 reserved keyword)
        nativ = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },
        compliantExecNpcg = nativ.exec.call(/()??/, "")[1] === undefined, // check `exec` handling of nonparticipating capturing groups
        compliantLastIndexIncrement = function () {
            var x = /^/g;
            nativ.test.call(x, "");
            return !x.lastIndex;
        }(),
        hasNativeY = RegExp.prototype.sticky !== undefined,
        nativeTokens = {};

    // `nativeTokens` match native multicharacter metasequences only (including deprecated octals,
    // excluding character classes)
    nativeTokens[XRegExp.INSIDE_CLASS] = /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/;
    nativeTokens[XRegExp.OUTSIDE_CLASS] = /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/;


    //---------------------------------
    //  Public methods
    //---------------------------------

    // Lets you extend or change XRegExp syntax and create custom flags. This is used internally by
    // the XRegExp library and can be used to create XRegExp plugins. This function is intended for
    // users with advanced knowledge of JavaScript's regular expression syntax and behavior. It can
    // be disabled by `XRegExp.freezeTokens`
    XRegExp.addToken = function (regex, handler, scope, trigger) {
        tokens.push({
            pattern: clone(regex, "g" + (hasNativeY ? "y" : "")),
            handler: handler,
            scope: scope || XRegExp.OUTSIDE_CLASS,
            trigger: trigger || null
        });
    };

    // Accepts a pattern and flags; returns an extended `RegExp` object. If the pattern and flag
    // combination has previously been cached, the cached copy is returned; otherwise the newly
    // created regex is cached
    XRegExp.cache = function (pattern, flags) {
        var key = pattern + "/" + (flags || "");
        return XRegExp.cache[key] || (XRegExp.cache[key] = XRegExp(pattern, flags));
    };

    // Accepts a `RegExp` instance; returns a copy with the `/g` flag set. The copy has a fresh
    // `lastIndex` (set to zero). If you want to copy a regex without forcing the `global`
    // property, use `XRegExp(regex)`. Do not use `RegExp(regex)` because it will not preserve
    // special properties required for named capture
    XRegExp.copyAsGlobal = function (regex) {
        return clone(regex, "g");
    };

    // Accepts a string; returns the string with regex metacharacters escaped. The returned string
    // can safely be used at any point within a regex to match the provided literal string. Escaped
    // characters are [ ] { } ( ) * + ? - . , \ ^ $ | # and whitespace
    XRegExp.escape = function (str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    // Accepts a string to search, regex to search with, position to start the search within the
    // string (default: 0), and an optional Boolean indicating whether matches must start at-or-
    // after the position or at the specified position only. This function ignores the `lastIndex`
    // of the provided regex in its own handling, but updates the property for compatibility
    XRegExp.execAt = function (str, regex, pos, anchored) {
        var r2 = clone(regex, "g" + ((anchored && hasNativeY) ? "y" : "")),
            match;
        r2.lastIndex = pos = pos || 0;
        match = r2.exec(str); // Run the altered `exec` (required for `lastIndex` fix, etc.)
        if (anchored && match && match.index !== pos)
            match = null;
        if (regex.global)
            regex.lastIndex = match ? r2.lastIndex : 0;
        return match;
    };

    // Breaks the unrestorable link to XRegExp's private list of tokens, thereby preventing
    // syntax and flag changes. Should be run after XRegExp and any plugins are loaded
    XRegExp.freezeTokens = function () {
        XRegExp.addToken = function () {
            throw Error("can't run addToken after freezeTokens");
        };
    };

    // Accepts any value; returns a Boolean indicating whether the argument is a `RegExp` object.
    // Note that this is also `true` for regex literals and regexes created by the `XRegExp`
    // constructor. This works correctly for variables created in another frame, when `instanceof`
    // and `constructor` checks would fail to work as intended
    XRegExp.isRegExp = function (o) {
        return Object.prototype.toString.call(o) === "[object RegExp]";
    };

    // Executes `callback` once per match within `str`. Provides a simpler and cleaner way to
    // iterate over regex matches compared to the traditional approaches of subverting
    // `String.prototype.replace` or repeatedly calling `exec` within a `while` loop
    XRegExp.iterate = function (str, regex, callback, context) {
        var r2 = clone(regex, "g"),
            i = -1, match;
        while (match = r2.exec(str)) { // Run the altered `exec` (required for `lastIndex` fix, etc.)
            if (regex.global)
                regex.lastIndex = r2.lastIndex; // Doing this to follow expectations if `lastIndex` is checked within `callback`
            callback.call(context, match, ++i, str, regex);
            if (r2.lastIndex === match.index)
                r2.lastIndex++;
        }
        if (regex.global)
            regex.lastIndex = 0;
    };

    // Accepts a string and an array of regexes; returns the result of using each successive regex
    // to search within the matches of the previous regex. The array of regexes can also contain
    // objects with `regex` and `backref` properties, in which case the named or numbered back-
    // references specified are passed forward to the next regex or returned. E.g.:
    // var xregexpImgFileNames = XRegExp.matchChain(html, [
    //     {regex: /<img\b([^>]+)>/i, backref: 1}, // <img> tag attributes
    //     {regex: XRegExp('(?ix) \\s src=" (?<src> [^"]+ )'), backref: "src"}, // src attribute values
    //     {regex: XRegExp("^http://xregexp\\.com(/[^#?]+)", "i"), backref: 1}, // xregexp.com paths
    //     /[^\/]+$/ // filenames (strip directory paths)
    // ]);
    XRegExp.matchChain = function (str, chain) {
        return function recurseChain (values, level) {
            var item = chain[level].regex ? chain[level] : {regex: chain[level]},
                regex = clone(item.regex, "g"),
                matches = [], i;
            for (i = 0; i < values.length; i++) {
                XRegExp.iterate(values[i], regex, function (match) {
                    matches.push(item.backref ? (match[item.backref] || "") : match[0]);
                });
            }
            return ((level === chain.length - 1) || !matches.length) ?
                matches : recurseChain(matches, level + 1);
        }([str], 0);
    };


    //---------------------------------
    //  New RegExp prototype methods
    //---------------------------------

    // Accepts a context object and arguments array; returns the result of calling `exec` with the
    // first value in the arguments array. the context is ignored but is accepted for congruity
    // with `Function.prototype.apply`
    RegExp.prototype.apply = function (context, args) {
        return this.exec(args[0]);
    };

    // Accepts a context object and string; returns the result of calling `exec` with the provided
    // string. the context is ignored but is accepted for congruity with `Function.prototype.call`
    RegExp.prototype.call = function (context, str) {
        return this.exec(str);
    };


    //---------------------------------
    //  Overriden native methods
    //---------------------------------

    // Adds named capture support (with backreferences returned as `result.name`), and fixes two
    // cross-browser issues per ES3:
    // - Captured values for nonparticipating capturing groups should be returned as `undefined`,
    //   rather than the empty string.
    // - `lastIndex` should not be incremented after zero-length matches.
    RegExp.prototype.exec = function (str) {
        var match, name, r2, origLastIndex;
        if (!this.global)
            origLastIndex = this.lastIndex;
        match = nativ.exec.apply(this, arguments);
        if (match) {
            // Fix browsers whose `exec` methods don't consistently return `undefined` for
            // nonparticipating capturing groups
            if (!compliantExecNpcg && match.length > 1 && indexOf(match, "") > -1) {
                r2 = RegExp(this.source, nativ.replace.call(getNativeFlags(this), "g", ""));
                // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
                // matching due to characters outside the match
                nativ.replace.call((str + "").slice(match.index), r2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                        if (arguments[i] === undefined)
                            match[i] = undefined;
                    }
                });
            }
            // Attach named capture properties
            if (this._xregexp && this._xregexp.captureNames) {
                for (var i = 1; i < match.length; i++) {
                    name = this._xregexp.captureNames[i - 1];
                    if (name)
                       match[name] = match[i];
                }
            }
            // Fix browsers that increment `lastIndex` after zero-length matches
            if (!compliantLastIndexIncrement && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
        }
        if (!this.global)
            this.lastIndex = origLastIndex; // Fix IE, Opera bug (last tested IE 9.0.5, Opera 11.61 on Windows)
        return match;
    };

    // Fix browser bugs in native method
    RegExp.prototype.test = function (str) {
        // Use the native `exec` to skip some processing overhead, even though the altered
        // `exec` would take care of the `lastIndex` fixes
        var match, origLastIndex;
        if (!this.global)
            origLastIndex = this.lastIndex;
        match = nativ.exec.call(this, str);
        // Fix browsers that increment `lastIndex` after zero-length matches
        if (match && !compliantLastIndexIncrement && this.global && !match[0].length && (this.lastIndex > match.index))
            this.lastIndex--;
        if (!this.global)
            this.lastIndex = origLastIndex; // Fix IE, Opera bug (last tested IE 9.0.5, Opera 11.61 on Windows)
        return !!match;
    };

    // Adds named capture support and fixes browser bugs in native method
    String.prototype.match = function (regex) {
        if (!XRegExp.isRegExp(regex))
            regex = RegExp(regex); // Native `RegExp`
        if (regex.global) {
            var result = nativ.match.apply(this, arguments);
            regex.lastIndex = 0; // Fix IE bug
            return result;
        }
        return regex.exec(this); // Run the altered `exec`
    };

    // Adds support for `${n}` tokens for named and numbered backreferences in replacement text,
    // and provides named backreferences to replacement functions as `arguments[0].name`. Also
    // fixes cross-browser differences in replacement text syntax when performing a replacement
    // using a nonregex search value, and the value of replacement regexes' `lastIndex` property
    // during replacement iterations. Note that this doesn't support SpiderMonkey's proprietary
    // third (`flags`) parameter
    String.prototype.replace = function (search, replacement) {
        var isRegex = XRegExp.isRegExp(search),
            captureNames, result, str, origLastIndex;

        // There are too many combinations of search/replacement types/values and browser bugs that
        // preclude passing to native `replace`, so don't try
        //if (...)
        //    return nativ.replace.apply(this, arguments);

        if (isRegex) {
            if (search._xregexp)
                captureNames = search._xregexp.captureNames; // Array or `null`
            if (!search.global)
                origLastIndex = search.lastIndex;
        } else {
            search = search + ""; // Type conversion
        }

        if (Object.prototype.toString.call(replacement) === "[object Function]") {
            result = nativ.replace.call(this + "", search, function () {
                if (captureNames) {
                    // Change the `arguments[0]` string primitive to a String object which can store properties
                    arguments[0] = new String(arguments[0]);
                    // Store named backreferences on `arguments[0]`
                    for (var i = 0; i < captureNames.length; i++) {
                        if (captureNames[i])
                            arguments[0][captureNames[i]] = arguments[i + 1];
                    }
                }
                // Update `lastIndex` before calling `replacement` (fix browsers)
                if (isRegex && search.global)
                    search.lastIndex = arguments[arguments.length - 2] + arguments[0].length;
                return replacement.apply(null, arguments);
            });
        } else {
            str = this + ""; // Type conversion, so `args[args.length - 1]` will be a string (given nonstring `this`)
            result = nativ.replace.call(str, search, function () {
                var args = arguments; // Keep this function's `arguments` available through closure
                return nativ.replace.call(replacement + "", replacementToken, function ($0, $1, $2) {
                    // Numbered backreference (without delimiters) or special variable
                    if ($1) {
                        switch ($1) {
                            case "$": return "$";
                            case "&": return args[0];
                            case "`": return args[args.length - 1].slice(0, args[args.length - 2]);
                            case "'": return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
                            // Numbered backreference
                            default:
                                // What does "$10" mean?
                                // - Backreference 10, if 10 or more capturing groups exist
                                // - Backreference 1 followed by "0", if 1-9 capturing groups exist
                                // - Otherwise, it's the string "$10"
                                // Also note:
                                // - Backreferences cannot be more than two digits (enforced by `replacementToken`)
                                // - "$01" is equivalent to "$1" if a capturing group exists, otherwise it's the string "$01"
                                // - There is no "$0" token ("$&" is the entire match)
                                var literalNumbers = "";
                                $1 = +$1; // Type conversion; drop leading zero
                                if (!$1) // `$1` was "0" or "00"
                                    return $0;
                                while ($1 > args.length - 3) {
                                    literalNumbers = String.prototype.slice.call($1, -1) + literalNumbers;
                                    $1 = Math.floor($1 / 10); // Drop the last digit
                                }
                                return ($1 ? args[$1] || "" : "$") + literalNumbers;
                        }
                    // Named backreference or delimited numbered backreference
                    } else {
                        // What does "${n}" mean?
                        // - Backreference to numbered capture n. Two differences from "$n":
                        //   - n can be more than two digits
                        //   - Backreference 0 is allowed, and is the entire match
                        // - Backreference to named capture n, if it exists and is not a number overridden by numbered capture
                        // - Otherwise, it's the string "${n}"
                        var n = +$2; // Type conversion; drop leading zeros
                        if (n <= args.length - 3)
                            return args[n];
                        n = captureNames ? indexOf(captureNames, $2) : -1;
                        return n > -1 ? args[n + 1] : $0;
                    }
                });
            });
        }

        if (isRegex) {
            if (search.global)
                search.lastIndex = 0; // Fix IE, Safari bug (last tested IE 9.0.5, Safari 5.1.2 on Windows)
            else
                search.lastIndex = origLastIndex; // Fix IE, Opera bug (last tested IE 9.0.5, Opera 11.61 on Windows)
        }

        return result;
    };

    // A consistent cross-browser, ES3 compliant `split`
    String.prototype.split = function (s /* separator */, limit) {
        // If separator `s` is not a regex, use the native `split`
        if (!XRegExp.isRegExp(s))
            return nativ.split.apply(this, arguments);

        var str = this + "", // Type conversion
            output = [],
            lastLastIndex = 0,
            match, lastLength;

        // Behavior for `limit`: if it's...
        // - `undefined`: No limit
        // - `NaN` or zero: Return an empty array
        // - A positive number: Use `Math.floor(limit)`
        // - A negative number: No limit
        // - Other: Type-convert, then use the above rules
        if (limit === undefined || +limit < 0) {
            limit = Infinity;
        } else {
            limit = Math.floor(+limit);
            if (!limit)
                return [];
        }

        // This is required if not `s.global`, and it avoids needing to set `s.lastIndex` to zero
        // and restore it to its original value when we're done using the regex
        s = XRegExp.copyAsGlobal(s);

        while (match = s.exec(str)) { // Run the altered `exec` (required for `lastIndex` fix, etc.)
            if (s.lastIndex > lastLastIndex) {
                output.push(str.slice(lastLastIndex, match.index));

                if (match.length > 1 && match.index < str.length)
                    Array.prototype.push.apply(output, match.slice(1));

                lastLength = match[0].length;
                lastLastIndex = s.lastIndex;

                if (output.length >= limit)
                    break;
            }

            if (s.lastIndex === match.index)
                s.lastIndex++;
        }

        if (lastLastIndex === str.length) {
            if (!nativ.test.call(s, "") || lastLength)
                output.push("");
        } else {
            output.push(str.slice(lastLastIndex));
        }

        return output.length > limit ? output.slice(0, limit) : output;
    };


    //---------------------------------
    //  Private helper functions
    //---------------------------------

    // Supporting function for `XRegExp`, `XRegExp.copyAsGlobal`, etc. Returns a copy of a `RegExp`
    // instance with a fresh `lastIndex` (set to zero), preserving properties required for named
    // capture. Also allows adding new flags in the process of copying the regex
    function clone (regex, additionalFlags) {
        if (!XRegExp.isRegExp(regex))
            throw TypeError("type RegExp expected");
        var x = regex._xregexp;
        regex = XRegExp(regex.source, getNativeFlags(regex) + (additionalFlags || ""));
        if (x) {
            regex._xregexp = {
                source: x.source,
                captureNames: x.captureNames ? x.captureNames.slice(0) : null
            };
        }
        return regex;
    }

    function getNativeFlags (regex) {
        return (regex.global     ? "g" : "") +
               (regex.ignoreCase ? "i" : "") +
               (regex.multiline  ? "m" : "") +
               (regex.extended   ? "x" : "") + // Proposed for ES4; included in AS3
               (regex.sticky     ? "y" : "");
    }

    function runTokens (pattern, index, scope, context) {
        var i = tokens.length,
            result, match, t;
        // Protect against constructing XRegExps within token handler and trigger functions
        isInsideConstructor = true;
        // Must reset `isInsideConstructor`, even if a `trigger` or `handler` throws
        try {
            while (i--) { // Run in reverse order
                t = tokens[i];
                if ((scope & t.scope) && (!t.trigger || t.trigger.call(context))) {
                    t.pattern.lastIndex = index;
                    match = t.pattern.exec(pattern); // Running the altered `exec` here allows use of named backreferences, etc.
                    if (match && match.index === index) {
                        result = {
                            output: t.handler.call(context, match, scope),
                            match: match
                        };
                        break;
                    }
                }
            }
        } catch (err) {
            throw err;
        } finally {
            isInsideConstructor = false;
        }
        return result;
    }

    function indexOf (array, item, from) {
        if (Array.prototype.indexOf) // Use the native array method if available
            return array.indexOf(item, from);
        for (var i = from || 0; i < array.length; i++) {
            if (array[i] === item)
                return i;
        }
        return -1;
    }


    //---------------------------------
    //  Built-in tokens
    //---------------------------------

    // Augment XRegExp's regular expression syntax and flags. Note that when adding tokens, the
    // third (`scope`) argument defaults to `XRegExp.OUTSIDE_CLASS`

    // Comment pattern: (?# )
    XRegExp.addToken(
        /\(\?#[^)]*\)/,
        function (match) {
            // Keep tokens separated unless the following token is a quantifier
            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
        }
    );

    // Capturing group (match the opening parenthesis only).
    // Required for support of named capturing groups
    XRegExp.addToken(
        /\((?!\?)/,
        function () {
            this.captureNames.push(null);
            return "(";
        }
    );

    // Named capturing group (match the opening delimiter only): (?<name>
    XRegExp.addToken(
        /\(\?<([$\w]+)>/,
        function (match) {
            this.captureNames.push(match[1]);
            this.hasNamedCapture = true;
            return "(";
        }
    );

    // Named backreference: \k<name>
    XRegExp.addToken(
        /\\k<([\w$]+)>/,
        function (match) {
            var index = indexOf(this.captureNames, match[1]);
            // Keep backreferences separate from subsequent literal numbers. Preserve back-
            // references to named groups that are undefined at this point as literal strings
            return index > -1 ?
                "\\" + (index + 1) + (isNaN(match.input.charAt(match.index + match[0].length)) ? "" : "(?:)") :
                match[0];
        }
    );

    // Empty character class: [] or [^]
    XRegExp.addToken(
        /\[\^?]/,
        function (match) {
            // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
            // (?!) should work like \b\B, but is unreliable in Firefox
            return match[0] === "[]" ? "\\b\\B" : "[\\s\\S]";
        }
    );

    // Mode modifier at the start of the pattern only, with any combination of flags imsx: (?imsx)
    // Does not support x(?i), (?-i), (?i-m), (?i: ), (?i)(?m), etc.
    XRegExp.addToken(
        /^\(\?([imsx]+)\)/,
        function (match) {
            this.setFlag(match[1]);
            return "";
        }
    );

    // Whitespace and comments, in free-spacing (aka extended) mode only
    XRegExp.addToken(
        /(?:\s+|#.*)+/,
        function (match) {
            // Keep tokens separated unless the following token is a quantifier
            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
        },
        XRegExp.OUTSIDE_CLASS,
        function () {return this.hasFlag("x");}
    );

    // Dot, in dotall (aka singleline) mode only
    XRegExp.addToken(
        /\./,
        function () {return "[\\s\\S]";},
        XRegExp.OUTSIDE_CLASS,
        function () {return this.hasFlag("s");}
    );


    //---------------------------------
    //  Backward compatibility
    //---------------------------------

    // Uncomment the following block for compatibility with XRegExp 1.0-1.2:
    /*
    XRegExp.matchWithinChain = XRegExp.matchChain;
    RegExp.prototype.addFlags = function (s) {return clone(this, s);};
    RegExp.prototype.execAll = function (s) {var r = []; XRegExp.iterate(s, this, function (m) {r.push(m);}); return r;};
    RegExp.prototype.forEachExec = function (s, f, c) {return XRegExp.iterate(s, this, f, c);};
    RegExp.prototype.validate = function (s) {var r = RegExp("^(?:" + this.source + ")$(?!\\s)", getNativeFlags(this)); if (this.global) this.lastIndex = 0; return s.search(r) === 0;};
    */

})();


define("jam/SyntaxHighlighter/scripts/XRegExp.js", function(){});

//
// Begin anonymous function. This is used to contain local scope variables without polutting global scope.
//
if (typeof(SyntaxHighlighter) == 'undefined') var SyntaxHighlighter = function() { 

// CommonJS
if (typeof(require) != 'undefined' && typeof(XRegExp) == 'undefined')
{
	XRegExp = require('XRegExp').XRegExp;
}

// Shortcut object which will be assigned to the SyntaxHighlighter variable.
// This is a shorthand for local reference in order to avoid long namespace 
// references to SyntaxHighlighter.whatever...
var sh = {
	defaults : {
		/** Additional CSS class names to be added to highlighter elements. */
		'class-name' : '',
		
		/** First line number. */
		'first-line' : 1,
		
		/**
		 * Pads line numbers. Possible values are:
		 *
		 *   false - don't pad line numbers.
		 *   true  - automaticaly pad numbers with minimum required number of leading zeroes.
		 *   [int] - length up to which pad line numbers.
		 */
		'pad-line-numbers' : false,
		
		/** Lines to highlight. */
		'highlight' : null,
		
		/** Title to be displayed above the code block. */
		'title' : null,
		
		/** Enables or disables smart tabs. */
		'smart-tabs' : true,
		
		/** Gets or sets tab size. */
		'tab-size' : 4,
		
		/** Enables or disables gutter. */
		'gutter' : true,
		
		/** Enables or disables toolbar. */
		'toolbar' : true,
		
		/** Enables quick code copy and paste from double click. */
		'quick-code' : true,
		
		/** Forces code view to be collapsed. */
		'collapse' : false,
		
		/** Enables or disables automatic links. */
		'auto-links' : true,
		
		/** Gets or sets light mode. Equavalent to turning off gutter and toolbar. */
		'light' : false,

		'unindent' : true,
		
		'html-script' : false
	},
	
	config : {
		space : '&nbsp;',
		
		/** Enables use of <SCRIPT type="syntaxhighlighter" /> tags. */
		useScriptTags : true,
		
		/** Blogger mode flag. */
		bloggerMode : false,
		
		stripBrs : false,
		
		/** Name of the tag that SyntaxHighlighter will automatically look for. */
		tagName : 'pre',
		
		strings : {
			expandSource : 'expand source',
			help : '?',
			alert: 'SyntaxHighlighter\n\n',
			noBrush : 'Can\'t find brush for: ',
			brushNotHtmlScript : 'Brush wasn\'t configured for html-script option: ',
			
			// this is populated by the build script
			aboutDialog : '@ABOUT@'
		}
	},
	
	/** Internal 'global' variables. */
	vars : {
		discoveredBrushes : null,
		highlighters : {}
	},
	
	/** This object is populated by user included external brush files. */
	brushes : {},

	/** Common regular expressions. */
	regexLib : {
		multiLineCComments			: /\/\*[\s\S]*?\*\//gm,
		singleLineCComments			: /\/\/.*$/gm,
		singleLinePerlComments		: /#.*$/gm,
		doubleQuotedString			: /"([^\\"\n]|\\.)*"/g,
		singleQuotedString			: /'([^\\'\n]|\\.)*'/g,
		multiLineDoubleQuotedString	: new XRegExp('"([^\\\\"]|\\\\.)*"', 'gs'),
		multiLineSingleQuotedString	: new XRegExp("'([^\\\\']|\\\\.)*'", 'gs'),
		xmlComments					: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm,
		url							: /\w+:\/\/[\w-.\/?%&=:@;#]*/g,
		
		/** <?= ?> tags. */
		phpScriptTags 				: { left: /(&lt;|<)\?(?:=|php)?/g, right: /\?(&gt;|>)/g, 'eof' : true },
		
		/** <%= %> tags. */
		aspScriptTags				: { left: /(&lt;|<)%=?/g, right: /%(&gt;|>)/g },
		
		/** <script> tags. */
		scriptScriptTags			: { left: /(&lt;|<)\s*script.*?(&gt;|>)/gi, right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi }
	},

	toolbar: {
		/**
		 * Generates HTML markup for the toolbar.
		 * @param {Highlighter} highlighter Highlighter instance.
		 * @return {String} Returns HTML markup.
		 */
		getHtml: function(highlighter)
		{
			var html = '<div class="toolbar">',
				items = sh.toolbar.items,
				list = items.list
				;
			
			function defaultGetHtml(highlighter, name)
			{
				return sh.toolbar.getButtonHtml(highlighter, name, sh.config.strings[name]);
			};
			
			for (var i = 0; i < list.length; i++)
				html += (items[list[i]].getHtml || defaultGetHtml)(highlighter, list[i]);
			
			html += '</div>';
			
			return html;
		},
		
		/**
		 * Generates HTML markup for a regular button in the toolbar.
		 * @param {Highlighter} highlighter Highlighter instance.
		 * @param {String} commandName		Command name that would be executed.
		 * @param {String} label			Label text to display.
		 * @return {String}					Returns HTML markup.
		 */
		getButtonHtml: function(highlighter, commandName, label)
		{
			return '<span><a href="#" class="toolbar_item'
				+ ' command_' + commandName
				+ ' ' + commandName
				+ '">' + label + '</a></span>'
				;
		},
		
		/**
		 * Event handler for a toolbar anchor.
		 */
		handler: function(e)
		{
			var target = e.target,
				className = target.className || ''
				;

			function getValue(name)
			{
				var r = new RegExp(name + '_(\\w+)'),
					match = r.exec(className)
					;

				return match ? match[1] : null;
			};
			
			var highlighter = getHighlighterById(findParentElement(target, '.syntaxhighlighter').id),
				commandName = getValue('command')
				;
			
			// execute the toolbar command
			if (highlighter && commandName)
				sh.toolbar.items[commandName].execute(highlighter);

			// disable default A click behaviour
			e.preventDefault();
		},
		
		/** Collection of toolbar items. */
		items : {
			// Ordered lis of items in the toolbar. Can't expect `for (var n in items)` to be consistent.
			list: ['expandSource', 'help'],

			expandSource: {
				getHtml: function(highlighter)
				{
					if (highlighter.getParam('collapse') != true)
						return '';
						
					var title = highlighter.getParam('title');
					return sh.toolbar.getButtonHtml(highlighter, 'expandSource', title ? title : sh.config.strings.expandSource);
				},
			
				execute: function(highlighter)
				{
					var div = getHighlighterDivById(highlighter.id);
					removeClass(div, 'collapsed');
				}
			},

			/** Command to display the about dialog window. */
			help: {
				execute: function(highlighter)
				{	
					var wnd = popup('', '_blank', 500, 250, 'scrollbars=0'),
						doc = wnd.document
						;
					
					doc.write(sh.config.strings.aboutDialog);
					doc.close();
					wnd.focus();
				}
			}
		}
	},

	/**
	 * Finds all elements on the page which should be processes by SyntaxHighlighter.
	 *
	 * @param {Object} globalParams		Optional parameters which override element's 
	 * 									parameters. Only used if element is specified.
	 * 
	 * @param {Object} element	Optional element to highlight. If none is
	 * 							provided, all elements in the current document 
	 * 							are returned which qualify.
	 *
	 * @return {Array}	Returns list of <code>{ target: DOMElement, params: Object }</code> objects.
	 */
	findElements: function(globalParams, element)
	{
		var elements = element ? [element] : toArray(document.getElementsByTagName(sh.config.tagName)), 
			conf = sh.config,
			result = []
			;

		// support for <SCRIPT TYPE="syntaxhighlighter" /> feature
		if (conf.useScriptTags)
			elements = elements.concat(getSyntaxHighlighterScriptTags());

		if (elements.length === 0) 
			return result;
	
		for (var i = 0; i < elements.length; i++) 
		{
			var item = {
				target: elements[i], 
				// local params take precedence over globals
				params: merge(globalParams, parseParams(elements[i].className))
			};

			if (item.params['brush'] == null)
				continue;
				
			result.push(item);
		}
		
		return result;
	},

	/**
	 * Shorthand to highlight all elements on the page that are marked as 
	 * SyntaxHighlighter source code.
	 * 
	 * @param {Object} globalParams		Optional parameters which override element's 
	 * 									parameters. Only used if element is specified.
	 * 
	 * @param {Object} element	Optional element to highlight. If none is
	 * 							provided, all elements in the current document 
	 * 							are highlighted.
	 */ 
	highlight: function(globalParams, element)
	{
		var elements = this.findElements(globalParams, element),
			propertyName = 'innerHTML', 
			highlighter = null,
			conf = sh.config
			;

		if (elements.length === 0) 
			return;
	
		for (var i = 0; i < elements.length; i++) 
		{
			var element = elements[i],
				target = element.target,
				params = element.params,
				brushName = params.brush,
				code
				;

			if (brushName == null)
				continue;

			// Instantiate a brush
			if (params['html-script'] == 'true' || sh.defaults['html-script'] == true) 
			{
				highlighter = new sh.HtmlScript(brushName);
				brushName = 'htmlscript';
			}
			else
			{
				var brush = findBrush(brushName);
				
				if (brush)
					highlighter = new brush();
				else
					continue;
			}
			
			code = target[propertyName];
			
			// remove CDATA from <SCRIPT/> tags if it's present
			if (conf.useScriptTags)
				code = stripCData(code);
				
			// Inject title if the attribute is present
			if ((target.title || '') != '')
				params.title = target.title;
				
			params['brush'] = brushName;
			highlighter.init(params);
			element = highlighter.getDiv(code);
			
			// carry over ID
			if ((target.id || '') != '')
				element.id = target.id;
			
			target.parentNode.replaceChild(element, target);
		}
	},

	/**
	 * Main entry point for the SyntaxHighlighter.
	 * @param {Object} params Optional params to apply to all highlighted elements.
	 */
	all: function(params)
	{
		attachEvent(
			window,
			'load',
			function() { sh.highlight(params); }
		);
	}
}; // end of sh

/**
 * Checks if target DOM elements has specified CSS class.
 * @param {DOMElement} target Target DOM element to check.
 * @param {String} className Name of the CSS class to check for.
 * @return {Boolean} Returns true if class name is present, false otherwise.
 */
function hasClass(target, className)
{
	return target.className.indexOf(className) != -1;
};

/**
 * Adds CSS class name to the target DOM element.
 * @param {DOMElement} target Target DOM element.
 * @param {String} className New CSS class to add.
 */
function addClass(target, className)
{
	if (!hasClass(target, className))
		target.className += ' ' + className;
};

/**
 * Removes CSS class name from the target DOM element.
 * @param {DOMElement} target Target DOM element.
 * @param {String} className CSS class to remove.
 */
function removeClass(target, className)
{
	target.className = target.className.replace(className, '');
};

/**
 * Converts the source to array object. Mostly used for function arguments and 
 * lists returned by getElementsByTagName() which aren't Array objects.
 * @param {List} source Source list.
 * @return {Array} Returns array.
 */
function toArray(source)
{
	var result = [];
	
	for (var i = 0; i < source.length; i++) 
		result.push(source[i]);
		
	return result;
};

/**
 * Splits block of text into lines.
 * @param {String} block Block of text.
 * @return {Array} Returns array of lines.
 */
function splitLines(block)
{
	return block.split(/\r?\n/);
}

/**
 * Generates HTML ID for the highlighter.
 * @param {String} highlighterId Highlighter ID.
 * @return {String} Returns HTML ID.
 */
function getHighlighterId(id)
{
	var prefix = 'highlighter_';
	return id.indexOf(prefix) == 0 ? id : prefix + id;
};

/**
 * Finds Highlighter instance by ID.
 * @param {String} highlighterId Highlighter ID.
 * @return {Highlighter} Returns instance of the highlighter.
 */
function getHighlighterById(id)
{
	return sh.vars.highlighters[getHighlighterId(id)];
};

/**
 * Finds highlighter's DIV container.
 * @param {String} highlighterId Highlighter ID.
 * @return {Element} Returns highlighter's DIV element.
 */
function getHighlighterDivById(id)
{
	return document.getElementById(getHighlighterId(id));
};

/**
 * Stores highlighter so that getHighlighterById() can do its thing. Each
 * highlighter must call this method to preserve itself.
 * @param {Highilghter} highlighter Highlighter instance.
 */
function storeHighlighter(highlighter)
{
	sh.vars.highlighters[getHighlighterId(highlighter.id)] = highlighter;
};

/**
 * Looks for a child or parent node which has specified classname.
 * Equivalent to jQuery's $(container).find(".className")
 * @param {Element} target Target element.
 * @param {String} search Class name or node name to look for.
 * @param {Boolean} reverse If set to true, will go up the node tree instead of down.
 * @return {Element} Returns found child or parent element on null.
 */
function findElement(target, search, reverse /* optional */)
{
	if (target == null)
		return null;
		
	var nodes			= reverse != true ? target.childNodes : [ target.parentNode ],
		propertyToFind	= { '#' : 'id', '.' : 'className' }[search.substr(0, 1)] || 'nodeName',
		expectedValue,
		found
		;

	expectedValue = propertyToFind != 'nodeName'
		? search.substr(1)
		: search.toUpperCase()
		;
		
	// main return of the found node
	if ((target[propertyToFind] || '').indexOf(expectedValue) != -1)
		return target;
	
	for (var i = 0; nodes && i < nodes.length && found == null; i++)
		found = findElement(nodes[i], search, reverse);
	
	return found;
};

/**
 * Looks for a parent node which has specified classname.
 * This is an alias to <code>findElement(container, className, true)</code>.
 * @param {Element} target Target element.
 * @param {String} className Class name to look for.
 * @return {Element} Returns found parent element on null.
 */
function findParentElement(target, className)
{
	return findElement(target, className, true);
};

/**
 * Finds an index of element in the array.
 * @ignore
 * @param {Object} searchElement
 * @param {Number} fromIndex
 * @return {Number} Returns index of element if found; -1 otherwise.
 */
function indexOf(array, searchElement, fromIndex)
{
	fromIndex = Math.max(fromIndex || 0, 0);

	for (var i = fromIndex; i < array.length; i++)
		if(array[i] == searchElement)
			return i;
	
	return -1;
};

/**
 * Generates a unique element ID.
 */
function guid(prefix)
{
	return (prefix || '') + Math.round(Math.random() * 1000000).toString();
};

/**
 * Merges two objects. Values from obj2 override values in obj1.
 * Function is NOT recursive and works only for one dimensional objects.
 * @param {Object} obj1 First object.
 * @param {Object} obj2 Second object.
 * @return {Object} Returns combination of both objects.
 */
function merge(obj1, obj2)
{
	var result = {}, name;

	for (name in obj1) 
		result[name] = obj1[name];
	
	for (name in obj2) 
		result[name] = obj2[name];
		
	return result;
};

/**
 * Attempts to convert string to boolean.
 * @param {String} value Input string.
 * @return {Boolean} Returns true if input was "true", false if input was "false" and value otherwise.
 */
function toBoolean(value)
{
	var result = { "true" : true, "false" : false }[value];
	return result == null ? value : result;
};

/**
 * Opens up a centered popup window.
 * @param {String} url		URL to open in the window.
 * @param {String} name		Popup name.
 * @param {int} width		Popup width.
 * @param {int} height		Popup height.
 * @param {String} options	window.open() options.
 * @return {Window}			Returns window instance.
 */
function popup(url, name, width, height, options)
{
	var x = (screen.width - width) / 2,
		y = (screen.height - height) / 2
		;
		
	options +=	', left=' + x + 
				', top=' + y +
				', width=' + width +
				', height=' + height
		;
	options = options.replace(/^,/, '');

	var win = window.open(url, name, options);
	win.focus();
	return win;
};

/**
 * Adds event handler to the target object.
 * @param {Object} obj		Target object.
 * @param {String} type		Name of the event.
 * @param {Function} func	Handling function.
 */
function attachEvent(obj, type, func, scope)
{
	function handler(e)
	{
		e = e || window.event;
		
		if (!e.target)
		{
			e.target = e.srcElement;
			e.preventDefault = function()
			{
				this.returnValue = false;
			};
		}
			
		func.call(scope || window, e);
	};
	
	if (obj.attachEvent) 
	{
		obj.attachEvent('on' + type, handler);
	}
	else 
	{
		obj.addEventListener(type, handler, false);
	}
};

/**
 * Displays an alert.
 * @param {String} str String to display.
 */
function alert(str)
{
	window.alert(sh.config.strings.alert + str);
};

/**
 * Finds a brush by its alias.
 *
 * @param {String} alias		Brush alias.
 * @param {Boolean} showAlert	Suppresses the alert if false.
 * @return {Brush}				Returns bursh constructor if found, null otherwise.
 */
function findBrush(alias, showAlert)
{
	var brushes = sh.vars.discoveredBrushes,
		result = null
		;
	
	if (brushes == null) 
	{
		brushes = {};
		
		// Find all brushes
		for (var brush in sh.brushes) 
		{
			var info = sh.brushes[brush],
				aliases = info.aliases
				;
			
			if (aliases == null) 
				continue;
			
			// keep the brush name
			info.brushName = brush.toLowerCase();
			
			for (var i = 0; i < aliases.length; i++) 
				brushes[aliases[i]] = brush;
		}
		
		sh.vars.discoveredBrushes = brushes;
	}
	
	result = sh.brushes[brushes[alias]];

	if (result == null && showAlert)
		alert(sh.config.strings.noBrush + alias);
	
	return result;
};

/**
 * Executes a callback on each line and replaces each line with result from the callback.
 * @param {Object} str			Input string.
 * @param {Object} callback		Callback function taking one string argument and returning a string.
 */
function eachLine(str, callback)
{
	var lines = splitLines(str);
	
	for (var i = 0; i < lines.length; i++)
		lines[i] = callback(lines[i], i);
		
	// include \r to enable copy-paste on windows (ie8) without getting everything on one line
	return lines.join('\r\n');
};

/**
 * This is a special trim which only removes first and last empty lines
 * and doesn't affect valid leading space on the first line.
 * 
 * @param {String} str   Input string
 * @return {String}      Returns string without empty first and last lines.
 */
function trimFirstAndLastLines(str)
{
	return str.replace(/^[ ]*[\n]+|[\n]*[ ]*$/g, '');
};

/**
 * Parses key/value pairs into hash object.
 * 
 * Understands the following formats:
 * - name: word;
 * - name: [word, word];
 * - name: "string";
 * - name: 'string';
 * 
 * For example:
 *   name1: value; name2: [value, value]; name3: 'value'
 *   
 * @param {String} str    Input string.
 * @return {Object}       Returns deserialized object.
 */
function parseParams(str)
{
	var match, 
		result = {},
		arrayRegex = new XRegExp("^\\[(?<values>(.*?))\\]$"),
		regex = new XRegExp(
			"(?<name>[\\w-]+)" +
			"\\s*:\\s*" +
			"(?<value>" +
				"[\\w-%#]+|" +		// word
				"\\[.*?\\]|" +		// [] array
				'".*?"|' +			// "" string
				"'.*?'" +			// '' string
			")\\s*;?",
			"g"
		)
		;

	while ((match = regex.exec(str)) != null) 
	{
		var value = match.value
			.replace(/^['"]|['"]$/g, '') // strip quotes from end of strings
			;
		
		// try to parse array value
		if (value != null && arrayRegex.test(value))
		{
			var m = arrayRegex.exec(value);
			value = m.values.length > 0 ? m.values.split(/\s*,\s*/) : [];
		}
		
		result[match.name] = value;
	}
	
	return result;
};

/**
 * Wraps each line of the string into <code/> tag with given style applied to it.
 * 
 * @param {String} str   Input string.
 * @param {String} css   Style name to apply to the string.
 * @return {String}      Returns input string with each line surrounded by <span/> tag.
 */
function wrapLinesWithCode(str, css)
{
	if (str == null || str.length == 0 || str == '\n') 
		return str;

	str = str.replace(/</g, '&lt;');

	// Replace two or more sequential spaces with &nbsp; leaving last space untouched.
	str = str.replace(/ {2,}/g, function(m)
	{
		var spaces = '';
		
		for (var i = 0; i < m.length - 1; i++)
			spaces += sh.config.space;
		
		return spaces + ' ';
	});

	// Split each line and apply <span class="...">...</span> to them so that
	// leading spaces aren't included.
	if (css != null) 
		str = eachLine(str, function(line)
		{
			if (line.length == 0) 
				return '';
			
			var spaces = '';
			
			line = line.replace(/^(&nbsp;| )+/, function(s)
			{
				spaces = s;
				return '';
			});
			
			if (line.length == 0) 
				return spaces;
			
			return spaces + '<code class="' + css + '">' + line + '</code>';
		});

	return str;
};

/**
 * Pads number with zeros until it's length is the same as given length.
 * 
 * @param {Number} number	Number to pad.
 * @param {Number} length	Max string length with.
 * @return {String}			Returns a string padded with proper amount of '0'.
 */
function padNumber(number, length)
{
	var result = number.toString();
	
	while (result.length < length)
		result = '0' + result;
	
	return result;
};

/**
 * Replaces tabs with spaces.
 * 
 * @param {String} code		Source code.
 * @param {Number} tabSize	Size of the tab.
 * @return {String}			Returns code with all tabs replaces by spaces.
 */
function processTabs(code, tabSize)
{
	var tab = '';
	
	for (var i = 0; i < tabSize; i++)
		tab += ' ';

	return code.replace(/\t/g, tab);
};

/**
 * Replaces tabs with smart spaces.
 * 
 * @param {String} code    Code to fix the tabs in.
 * @param {Number} tabSize Number of spaces in a column.
 * @return {String}        Returns code with all tabs replaces with roper amount of spaces.
 */
function processSmartTabs(code, tabSize)
{
	var lines = splitLines(code),
		tab = '\t',
		spaces = ''
		;
	
	// Create a string with 1000 spaces to copy spaces from... 
	// It's assumed that there would be no indentation longer than that.
	for (var i = 0; i < 50; i++) 
		spaces += '                    '; // 20 spaces * 50
			
	// This function inserts specified amount of spaces in the string
	// where a tab is while removing that given tab.
	function insertSpaces(line, pos, count)
	{
		return line.substr(0, pos)
			+ spaces.substr(0, count)
			+ line.substr(pos + 1, line.length) // pos + 1 will get rid of the tab
			;
	};

	// Go through all the lines and do the 'smart tabs' magic.
	code = eachLine(code, function(line)
	{
		if (line.indexOf(tab) == -1) 
			return line;
		
		var pos = 0;
		
		while ((pos = line.indexOf(tab)) != -1) 
		{
			// This is pretty much all there is to the 'smart tabs' logic.
			// Based on the position within the line and size of a tab,
			// calculate the amount of spaces we need to insert.
			var spaces = tabSize - pos % tabSize;
			line = insertSpaces(line, pos, spaces);
		}
		
		return line;
	});
	
	return code;
};

/**
 * Performs various string fixes based on configuration.
 */
function fixInputString(str)
{
	var br = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;
	
	if (sh.config.bloggerMode == true)
		str = str.replace(br, '\n');

	if (sh.config.stripBrs == true)
		str = str.replace(br, '');
		
	return str;
};

/**
 * Removes all white space at the begining and end of a string.
 * 
 * @param {String} str   String to trim.
 * @return {String}      Returns string without leading and following white space characters.
 */
function trim(str)
{
	return str.replace(/^\s+|\s+$/g, '');
};

/**
 * Unindents a block of text by the lowest common indent amount.
 * @param {String} str   Text to unindent.
 * @return {String}      Returns unindented text block.
 */
function unindent(str)
{
	var lines = splitLines(fixInputString(str)),
		indents = new Array(),
		regex = /^\s*/,
		min = 1000
		;
	
	// go through every line and check for common number of indents
	for (var i = 0; i < lines.length && min > 0; i++) 
	{
		var line = lines[i];
		
		if (trim(line).length == 0) 
			continue;
		
		var matches = regex.exec(line);
		
		// In the event that just one line doesn't have leading white space
		// we can't unindent anything, so bail completely.
		if (matches == null) 
			return str;
			
		min = Math.min(matches[0].length, min);
	}
	
	// trim minimum common number of white space from the begining of every line
	if (min > 0) 
		for (var i = 0; i < lines.length; i++) 
			lines[i] = lines[i].substr(min);
	
	return lines.join('\n');
};

/**
 * Callback method for Array.sort() which sorts matches by
 * index position and then by length.
 * 
 * @param {Match} m1	Left object.
 * @param {Match} m2    Right object.
 * @return {Number}     Returns -1, 0 or -1 as a comparison result.
 */
function matchesSortCallback(m1, m2)
{
	// sort matches by index first
	if(m1.index < m2.index)
		return -1;
	else if(m1.index > m2.index)
		return 1;
	else
	{
		// if index is the same, sort by length
		if(m1.length < m2.length)
			return -1;
		else if(m1.length > m2.length)
			return 1;
	}
	
	return 0;
};

/**
 * Executes given regular expression on provided code and returns all
 * matches that are found.
 * 
 * @param {String} code    Code to execute regular expression on.
 * @param {Object} regex   Regular expression item info from <code>regexList</code> collection.
 * @return {Array}         Returns a list of Match objects.
 */ 
function getMatches(code, regexInfo)
{
	function defaultAdd(match, regexInfo)
	{
		return match[0];
	};
	
	var index = 0,
		match = null,
		matches = [],
		func = regexInfo.func ? regexInfo.func : defaultAdd
		;
	
	while((match = regexInfo.regex.exec(code)) != null)
	{
		var resultMatch = func(match, regexInfo);
		
		if (typeof(resultMatch) == 'string')
			resultMatch = [new sh.Match(resultMatch, match.index, regexInfo.css)];

		matches = matches.concat(resultMatch);
	}
	
	return matches;
};

/**
 * Turns all URLs in the code into <a/> tags.
 * @param {String} code Input code.
 * @return {String} Returns code with </a> tags.
 */
function processUrls(code)
{
	var gt = /(.*)((&gt;|&lt;).*)/;
	
	return code.replace(sh.regexLib.url, function(m)
	{
		var suffix = '',
			match = null
			;
		
		// We include &lt; and &gt; in the URL for the common cases like <http://google.com>
		// The problem is that they get transformed into &lt;http://google.com&gt;
		// Where as &gt; easily looks like part of the URL string.
	
		if (match = gt.exec(m))
		{
			m = match[1];
			suffix = match[2];
		}
		
		return '<a href="' + m + '">' + m + '</a>' + suffix;
	});
};

/**
 * Finds all <SCRIPT TYPE="syntaxhighlighter" /> elementss.
 * @return {Array} Returns array of all found SyntaxHighlighter tags.
 */
function getSyntaxHighlighterScriptTags()
{
	var tags = document.getElementsByTagName('script'),
		result = []
		;
	
	for (var i = 0; i < tags.length; i++)
		if (tags[i].type == 'syntaxhighlighter')
			result.push(tags[i]);
			
	return result;
};

/**
 * Strips <![CDATA[]]> from <SCRIPT /> content because it should be used
 * there in most cases for XHTML compliance.
 * @param {String} original	Input code.
 * @return {String} Returns code without leading <![CDATA[]]> tags.
 */
function stripCData(original)
{
	var left = '<![CDATA[',
		right = ']]>',
		// for some reason IE inserts some leading blanks here
		copy = trim(original),
		changed = false,
		leftLength = left.length,
		rightLength = right.length
		;
	
	if (copy.indexOf(left) == 0)
	{
		copy = copy.substring(leftLength);
		changed = true;
	}
	
	var copyLength = copy.length;
	
	if (copy.indexOf(right) == copyLength - rightLength)
	{
		copy = copy.substring(0, copyLength - rightLength);
		changed = true;
	}
	
	return changed ? copy : original;
};


/**
 * Quick code mouse double click handler.
 */
function quickCodeHandler(e)
{
	var target = e.target,
		highlighterDiv = findParentElement(target, '.syntaxhighlighter'),
		container = findParentElement(target, '.container'),
		textarea = document.createElement('textarea'),
		highlighter
		;

	if (!container || !highlighterDiv || findElement(container, 'textarea'))
		return;

	highlighter = getHighlighterById(highlighterDiv.id);
	
	// add source class name
	addClass(highlighterDiv, 'source');

	// Have to go over each line and grab it's text, can't just do it on the
	// container because Firefox loses all \n where as Webkit doesn't.
	var lines = container.childNodes,
		code = []
		;
	
	for (var i = 0; i < lines.length; i++)
		code.push(lines[i].innerText || lines[i].textContent);
	
	// using \r instead of \r or \r\n makes this work equally well on IE, FF and Webkit
	code = code.join('\r');

    // For Webkit browsers, replace nbsp with a breaking space
    code = code.replace(/\u00a0/g, " ");
	
	// inject <textarea/> tag
	textarea.appendChild(document.createTextNode(code));
	container.appendChild(textarea);
	
	// preselect all text
	textarea.focus();
	textarea.select();
	
	// set up handler for lost focus
	attachEvent(textarea, 'blur', function(e)
	{
		textarea.parentNode.removeChild(textarea);
		removeClass(highlighterDiv, 'source');
	});
};

/**
 * Match object.
 */
sh.Match = function(value, index, css)
{
	this.value = value;
	this.index = index;
	this.length = value.length;
	this.css = css;
	this.brushName = null;
};

sh.Match.prototype.toString = function()
{
	return this.value;
};

/**
 * Simulates HTML code with a scripting language embedded.
 * 
 * @param {String} scriptBrushName Brush name of the scripting language.
 */
sh.HtmlScript = function(scriptBrushName)
{
	var brushClass = findBrush(scriptBrushName),
		scriptBrush,
		xmlBrush = new sh.brushes.Xml(),
		bracketsRegex = null,
		ref = this,
		methodsToExpose = 'getDiv getHtml init'.split(' ')
		;

	if (brushClass == null)
		return;
	
	scriptBrush = new brushClass();
	
	for(var i = 0; i < methodsToExpose.length; i++)
		// make a closure so we don't lose the name after i changes
		(function() {
			var name = methodsToExpose[i];
			
			ref[name] = function()
			{
				return xmlBrush[name].apply(xmlBrush, arguments);
			};
		})();
	
	if (scriptBrush.htmlScript == null)
	{
		alert(sh.config.strings.brushNotHtmlScript + scriptBrushName);
		return;
	}
	
	xmlBrush.regexList.push(
		{ regex: scriptBrush.htmlScript.code, func: process }
	);
	
	function offsetMatches(matches, offset)
	{
		for (var j = 0; j < matches.length; j++) 
			matches[j].index += offset;
	}
	
	function process(match, info)
	{
		var code = match.code,
			matches = [],
			regexList = scriptBrush.regexList,
			offset = match.index + match.left.length,
			htmlScript = scriptBrush.htmlScript,
			result
			;

		// add all matches from the code
		for (var i = 0; i < regexList.length; i++)
		{
			result = getMatches(code, regexList[i]);
			offsetMatches(result, offset);
			matches = matches.concat(result);
		}
		
		// add left script bracket
		if (htmlScript.left != null && match.left != null)
		{
			result = getMatches(match.left, htmlScript.left);
			offsetMatches(result, match.index);
			matches = matches.concat(result);
		}
		
		// add right script bracket
		if (htmlScript.right != null && match.right != null)
		{
			result = getMatches(match.right, htmlScript.right);
			offsetMatches(result, match.index + match[0].lastIndexOf(match.right));
			matches = matches.concat(result);
		}
		
		for (var j = 0; j < matches.length; j++)
			matches[j].brushName = brushClass.brushName;
			
		return matches;
	}
};

/**
 * Main Highlither class.
 * @constructor
 */
sh.Highlighter = function()
{
	// not putting any code in here because of the prototype inheritance
};

sh.Highlighter.prototype = {
	/**
	 * Returns value of the parameter passed to the highlighter.
	 * @param {String} name				Name of the parameter.
	 * @param {Object} defaultValue		Default value.
	 * @return {Object}					Returns found value or default value otherwise.
	 */
	getParam: function(name, defaultValue)
	{
		var result = this.params[name];
		return toBoolean(result == null ? defaultValue : result);
	},
	
	/**
	 * Shortcut to document.createElement().
	 * @param {String} name		Name of the element to create (DIV, A, etc).
	 * @return {HTMLElement}	Returns new HTML element.
	 */
	create: function(name)
	{
		return document.createElement(name);
	},
	
	/**
	 * Applies all regular expression to the code and stores all found
	 * matches in the `this.matches` array.
	 * @param {Array} regexList		List of regular expressions.
	 * @param {String} code			Source code.
	 * @return {Array}				Returns list of matches.
	 */
	findMatches: function(regexList, code)
	{
		var result = [];
		
		if (regexList != null)
			for (var i = 0; i < regexList.length; i++) 
				// BUG: length returns len+1 for array if methods added to prototype chain (oising@gmail.com)
				if (typeof (regexList[i]) == "object")
					result = result.concat(getMatches(code, regexList[i]));
		
		// sort and remove nested the matches
		return this.removeNestedMatches(result.sort(matchesSortCallback));
	},
	
	/**
	 * Checks to see if any of the matches are inside of other matches. 
	 * This process would get rid of highligted strings inside comments, 
	 * keywords inside strings and so on.
	 */
	removeNestedMatches: function(matches)
	{
		// Optimized by Jose Prado (http://joseprado.com)
		for (var i = 0; i < matches.length; i++) 
		{ 
			if (matches[i] === null)
				continue;
			
			var itemI = matches[i],
				itemIEndPos = itemI.index + itemI.length
				;
			
			for (var j = i + 1; j < matches.length && matches[i] !== null; j++) 
			{
				var itemJ = matches[j];
				
				if (itemJ === null) 
					continue;
				else if (itemJ.index > itemIEndPos) 
					break;
				else if (itemJ.index == itemI.index && itemJ.length > itemI.length)
					matches[i] = null;
				else if (itemJ.index >= itemI.index && itemJ.index < itemIEndPos) 
					matches[j] = null;
			}
		}
		
		return matches;
	},
	
	/**
	 * Creates an array containing integer line numbers starting from the 'first-line' param.
	 * @return {Array} Returns array of integers.
	 */
	figureOutLineNumbers: function(code)
	{
		var lines = [],
			firstLine = parseInt(this.getParam('first-line'))
			;
		
		eachLine(code, function(line, index)
		{
			lines.push(index + firstLine);
		});
		
		return lines;
	},
	
	/**
	 * Determines if specified line number is in the highlighted list.
	 */
	isLineHighlighted: function(lineNumber)
	{
		var list = this.getParam('highlight', []);
		
		if (typeof(list) != 'object' && list.push == null) 
			list = [ list ];
		
		return indexOf(list, lineNumber.toString()) != -1;
	},
	
	/**
	 * Generates HTML markup for a single line of code while determining alternating line style.
	 * @param {Integer} lineNumber	Line number.
	 * @param {String} code Line	HTML markup.
	 * @return {String}				Returns HTML markup.
	 */
	getLineHtml: function(lineIndex, lineNumber, code)
	{
		var classes = [
			'line',
			'number' + lineNumber,
			'index' + lineIndex,
			'alt' + (lineNumber % 2 == 0 ? 1 : 2).toString()
		];
		
		if (this.isLineHighlighted(lineNumber))
		 	classes.push('highlighted');
		
		if (lineNumber == 0)
			classes.push('break');
			
		return '<div class="' + classes.join(' ') + '">' + code + '</div>';
	},
	
	/**
	 * Generates HTML markup for line number column.
	 * @param {String} code			Complete code HTML markup.
	 * @param {Array} lineNumbers	Calculated line numbers.
	 * @return {String}				Returns HTML markup.
	 */
	getLineNumbersHtml: function(code, lineNumbers)
	{
		var html = '',
			count = splitLines(code).length,
			firstLine = parseInt(this.getParam('first-line')),
			pad = this.getParam('pad-line-numbers')
			;
		
		if (pad == true)
			pad = (firstLine + count - 1).toString().length;
		else if (isNaN(pad) == true)
			pad = 0;
			
		for (var i = 0; i < count; i++)
		{
			var lineNumber = lineNumbers ? lineNumbers[i] : firstLine + i,
				code = lineNumber == 0 ? sh.config.space : padNumber(lineNumber, pad)
				;
				
			html += this.getLineHtml(i, lineNumber, code);
		}
		
		return html;
	},
	
	/**
	 * Splits block of text into individual DIV lines.
	 * @param {String} code			Code to highlight.
	 * @param {Array} lineNumbers	Calculated line numbers.
	 * @return {String}				Returns highlighted code in HTML form.
	 */
	getCodeLinesHtml: function(html, lineNumbers)
	{
		html = trim(html);
		
		var lines = splitLines(html),
			padLength = this.getParam('pad-line-numbers'),
			firstLine = parseInt(this.getParam('first-line')),
			html = '',
			brushName = this.getParam('brush')
			;

		for (var i = 0; i < lines.length; i++)
		{
			var line = lines[i],
				indent = /^(&nbsp;|\s)+/.exec(line),
				spaces = null,
				lineNumber = lineNumbers ? lineNumbers[i] : firstLine + i;
				;

			if (indent != null)
			{
				spaces = indent[0].toString();
				line = line.substr(spaces.length);
				spaces = spaces.replace(' ', sh.config.space);
			}

			line = trim(line);
			
			if (line.length == 0)
				line = sh.config.space;
			
			html += this.getLineHtml(
				i,
				lineNumber, 
				(spaces != null ? '<code class="' + brushName + ' spaces">' + spaces + '</code>' : '') + line
			);
		}
		
		return html;
	},
	
	/**
	 * Returns HTML for the table title or empty string if title is null.
	 */
	getTitleHtml: function(title)
	{
		return title ? '<caption>' + title + '</caption>' : '';
	},
	
	/**
	 * Finds all matches in the source code.
	 * @param {String} code		Source code to process matches in.
	 * @param {Array} matches	Discovered regex matches.
	 * @return {String} Returns formatted HTML with processed mathes.
	 */
	getMatchesHtml: function(code, matches)
	{
		var pos = 0, 
			result = '',
			brushName = this.getParam('brush', '')
			;
		
		function getBrushNameCss(match)
		{
			var result = match ? (match.brushName || brushName) : brushName;
			return result ? result + ' ' : '';
		};
		
		// Finally, go through the final list of matches and pull the all
		// together adding everything in between that isn't a match.
		for (var i = 0; i < matches.length; i++) 
		{
			var match = matches[i],
				matchBrushName
				;
			
			if (match === null || match.length === 0) 
				continue;
			
			matchBrushName = getBrushNameCss(match);
			
			result += wrapLinesWithCode(code.substr(pos, match.index - pos), matchBrushName + 'plain')
					+ wrapLinesWithCode(match.value, matchBrushName + match.css)
					;

			pos = match.index + match.length + (match.offset || 0);
		}

		// don't forget to add whatever's remaining in the string
		result += wrapLinesWithCode(code.substr(pos), getBrushNameCss() + 'plain');

		return result;
	},
	
	/**
	 * Generates HTML markup for the whole syntax highlighter.
	 * @param {String} code Source code.
	 * @return {String} Returns HTML markup.
	 */
	getHtml: function(code)
	{
		var html = '',
			classes = [ 'syntaxhighlighter' ],
			tabSize,
			matches,
			lineNumbers
			;
		
		// process light mode
		if (this.getParam('light') == true)
			this.params.toolbar = this.params.gutter = false;

		className = 'syntaxhighlighter';

		if (this.getParam('collapse') == true)
			classes.push('collapsed');
		
		if ((gutter = this.getParam('gutter')) == false)
			classes.push('nogutter');

		// add custom user style name
		classes.push(this.getParam('class-name'));

		// add brush alias to the class name for custom CSS
		classes.push(this.getParam('brush'));

		code = trimFirstAndLastLines(code)
			.replace(/\r/g, ' ') // IE lets these buggers through
			;

		tabSize = this.getParam('tab-size');

		// replace tabs with spaces
		code = this.getParam('smart-tabs') == true
			? processSmartTabs(code, tabSize)
			: processTabs(code, tabSize)
			;

		// unindent code by the common indentation
		if (this.getParam('unindent'))
			code = unindent(code);

		if (gutter)
			lineNumbers = this.figureOutLineNumbers(code);
		
		// find matches in the code using brushes regex list
		matches = this.findMatches(this.regexList, code);
		// processes found matches into the html
		html = this.getMatchesHtml(code, matches);
		// finally, split all lines so that they wrap well
		html = this.getCodeLinesHtml(html, lineNumbers);

		// finally, process the links
		if (this.getParam('auto-links'))
			html = processUrls(html);
		
		if (typeof(navigator) != 'undefined' && navigator.userAgent && navigator.userAgent.match(/MSIE/))
			classes.push('ie');
		
		html = 
			'<div id="' + getHighlighterId(this.id) + '" class="' + classes.join(' ') + '">'
				+ (this.getParam('toolbar') ? sh.toolbar.getHtml(this) : '')
				+ '<table border="0" cellpadding="0" cellspacing="0">'
					+ this.getTitleHtml(this.getParam('title'))
					+ '<tbody>'
						+ '<tr>'
							+ (gutter ? '<td class="gutter">' + this.getLineNumbersHtml(code) + '</td>' : '')
							+ '<td class="code">'
								+ '<div class="container">'
									+ html
								+ '</div>'
							+ '</td>'
						+ '</tr>'
					+ '</tbody>'
				+ '</table>'
			+ '</div>'
			;
			
		return html;
	},
	
	/**
	 * Highlights the code and returns complete HTML.
	 * @param {String} code     Code to highlight.
	 * @return {Element}        Returns container DIV element with all markup.
	 */
	getDiv: function(code)
	{
		if (code === null) 
			code = '';
		
		this.code = code;

		var div = this.create('div');

		// create main HTML
		div.innerHTML = this.getHtml(code);
		
		// set up click handlers
		if (this.getParam('toolbar'))
			attachEvent(findElement(div, '.toolbar'), 'click', sh.toolbar.handler);
		
		if (this.getParam('quick-code'))
			attachEvent(findElement(div, '.code'), 'dblclick', quickCodeHandler);
		
		return div;
	},
	
	/**
	 * Initializes the highlighter/brush.
	 *
	 * Constructor isn't used for initialization so that nothing executes during necessary
	 * `new SyntaxHighlighter.Highlighter()` call when setting up brush inheritence.
	 *
	 * @param {Hash} params Highlighter parameters.
	 */
	init: function(params)
	{
		this.id = guid();
		
		// register this instance in the highlighters list
		storeHighlighter(this);
		
		// local params take precedence over defaults
		this.params = merge(sh.defaults, params || {})
		
		// process light mode
		if (this.getParam('light') == true)
			this.params.toolbar = this.params.gutter = false;
	},
	
	/**
	 * Converts space separated list of keywords into a regular expression string.
	 * @param {String} str    Space separated keywords.
	 * @return {String}       Returns regular expression string.
	 */
	getKeywords: function(str)
	{
		str = str
			.replace(/^\s+|\s+$/g, '')
			.replace(/\s+/g, '|')
			;
		
		return '\\b(?:' + str + ')\\b';
	},
	
	/**
	 * Makes a brush compatible with the `html-script` functionality.
	 * @param {Object} regexGroup Object containing `left` and `right` regular expressions.
	 */
	forHtmlScript: function(regexGroup)
	{
		var regex = { 'end' : regexGroup.right.source };

		if(regexGroup.eof)
			regex.end = "(?:(?:" + regex.end + ")|$)";
		
		this.htmlScript = {
			left : { regex: regexGroup.left, css: 'script' },
			right : { regex: regexGroup.right, css: 'script' },
			code : new XRegExp(
				"(?<left>" + regexGroup.left.source + ")" +
				"(?<code>.*?)" +
				"(?<right>" + regex.end + ")",
				"sgi"
				)
		};
	}
}; // end of Highlighter

return sh;
}(); // end of anonymous function

// CommonJS
typeof(exports) != 'undefined' ? exports.SyntaxHighlighter = SyntaxHighlighter : null;

define("jam/SyntaxHighlighter/scripts/shCore.js", function(){});

;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
		function process(match, regexInfo)
		{
			var constructor = SyntaxHighlighter.Match,
				code = match[0],
				tag = new XRegExp('(&lt;|<)[\\s\\/\\?]*(?<name>[:\\w-\\.]+)', 'xg').exec(code),
				result = []
				;
		
			if (match.attributes != null) 
			{
				var attributes,
					regex = new XRegExp('(?<name> [\\w:\\-\\.]+)' +
										'\\s*=\\s*' +
										'(?<value> ".*?"|\'.*?\'|\\w+)',
										'xg');

				while ((attributes = regex.exec(code)) != null) 
				{
					result.push(new constructor(attributes.name, match.index + attributes.index, 'color1'));
					result.push(new constructor(attributes.value, match.index + attributes.index + attributes[0].indexOf(attributes.value), 'string'));
				}
			}

			if (tag != null)
				result.push(
					new constructor(tag.name, match.index + tag[0].indexOf(tag.name), 'keyword')
				);

			return result;
		}
	
		this.regexList = [
			{ regex: new XRegExp('(\\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\\&gt;|>)', 'gm'),			css: 'color2' },	// <![ ... [ ... ]]>
			{ regex: SyntaxHighlighter.regexLib.xmlComments,												css: 'comments' },	// <!-- ... -->
			{ regex: new XRegExp('(&lt;|<)[\\s\\/\\?]*(\\w+)(?<attributes>.*?)[\\s\\/\\?]*(&gt;|>)', 'sg'), func: process }
		];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['xml', 'xhtml', 'xslt', 'html'];

	SyntaxHighlighter.brushes.Xml = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();

define("jam/SyntaxHighlighter/scripts/shBrushXml.js", function(){});

require([
  'jquery',
  'sinon',
  'jam/Patterns/src/registry',
  'js/bundles/widgets',
  'js/patterns/expose',
  'js/patterns/modal',
  'js/patterns/preventdoublesubmit',
  'js/patterns/formUnloadAlert',
  'jam/SyntaxHighlighter/scripts/XRegExp.js',
  'jam/SyntaxHighlighter/scripts/shCore.js',
  'jam/SyntaxHighlighter/scripts/shBrushXml.js'
], function($, sinon, registry) {

  // before demo patterns in overlay remove html created by autotoc pattern
  $('#modal1').on('show.modal.patterns', function(e, modal) {
    $('.autotoc-nav', modal.$modal).remove();
  });

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 4000;
  server.respondWith(/something.html/, function (xhr, id) {
    xhr.respond(200, { "Content-Type": "html/html" }, $('#something-html').html());
  });

  SyntaxHighlighter.all();

  // Initialize patterns
  $(document).ready(function() {
    registry.scan($('body'));
  });

});

define("js/demo/widgets", function(){});
