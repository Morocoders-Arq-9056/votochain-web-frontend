import type { VoteCastErrorCode } from "@/lib/domain/voting/vote-cast-error";

/**
 * Shared UI kernel: all user-facing copy in Spanish (es-PE, treatment of
 * "usted"). One source of truth — components, application services and
 * infrastructure read from here.
 */

export const RECORD_LABEL = "Código de constancia (hash al expandir)";
export const WALLET_WARNING = "Nunca pedir ni mostrar claves";

export const SIGNED_VOTE_PENDING_TITLE = "Su voto firmado aún no cuenta";
export const SIGNED_VOTE_PENDING_DETAIL =
  "Su intención se firmó y está en cola de envío. Solo Confirmado en blockchain cuenta.";
export const SIGNED_VOTE_PENDING_ACTION = "Ver recibo";

export const CONSUMED_AUTHORIZATION_TITLE = "Ya usó esta autorización";
export const CONSUMED_AUTHORIZATION_DETAIL =
  "La autorización fue consumida al firmar. El voto original se conserva. Consulte su recibo; no vuelva a votar con esta autorización.";

export const LATE_VOTE_TITLE = "Votación cerrada, voto tardío rechazado";
export const LATE_VOTE_DETAIL =
  "La propuesta cerró. No se firmó ni registró este intento. La autorización no permite votar después del cierre.";

export const AUTHORIZATION_EXPIRED_TITLE = "La autorización venció";
export const AUTHORIZATION_EXPIRED_DETAIL =
  "Para votar, solicite una nueva autorización desde el detalle de la propuesta.";
export const AUTHORIZATION_NO_WALLET =
  "Aún no tiene billetera de firma. Solicite su provisión antes de votar.";

export const NOT_FOUND_TITLE = "No encontramos ese registro";
export const NOT_FOUND_DETAIL = "Vuelva al inicio e intente de nuevo.";

export const UNAVAILABLE_TITLE = "No pudimos registrar su voto";
export const UNAVAILABLE_DETAIL =
  "Ocurrió un error. Intente de nuevo; su autorización sigue disponible.";

export const UNEXPECTED_TITLE = "Ocurrió un error";
export const UNEXPECTED_DETAIL = "Intente de nuevo en unos minutos.";

export const VOTE_CAST_MESSAGES: Record<VoteCastErrorCode, string> = {
  DOUBLE_VOTE: CONSUMED_AUTHORIZATION_TITLE,
  LATE_VOTE: LATE_VOTE_TITLE,
  AUTHORIZATION_EXPIRED: AUTHORIZATION_EXPIRED_TITLE,
  NOT_FOUND: NOT_FOUND_TITLE,
  UNAVAILABLE: UNAVAILABLE_TITLE,
  UNEXPECTED: UNEXPECTED_TITLE,
};

export const VOTE_CAST_DETAILS: Record<VoteCastErrorCode, string> = {
  DOUBLE_VOTE: CONSUMED_AUTHORIZATION_DETAIL,
  LATE_VOTE: LATE_VOTE_DETAIL,
  AUTHORIZATION_EXPIRED: AUTHORIZATION_EXPIRED_DETAIL,
  NOT_FOUND: NOT_FOUND_DETAIL,
  UNAVAILABLE: UNAVAILABLE_DETAIL,
  UNEXPECTED: UNEXPECTED_DETAIL,
};

// ---------------------------------------------------------------------------
// Acceso, OTP e Identidad (Figma 03, P1-P12). Usted, sobrio, sin tecnicismos.
// ---------------------------------------------------------------------------

export const ACCESS_BRAND = "VotaChain";
export const ACCESS_PRIVACY = "Privacidad";
export const ACCESS_LEGAL = "Privacidad - Términos";
export const ACCESS_SUPPORT = "Soporte";
export const NAV_HOME = "Inicio";
export const NAV_VOTE = "Votar";
export const NAV_VERIFICATION = "Verificación";
export const NAV_ACCOUNT = "Cuenta";
export const ACCESS_CONTEXT_EYEBROW = "Condominio Los Olivos";
export const ACCESS_CONTEXT_TITLE = "Acceso seguro. Participación verificable.";
export const ACCESS_CONTEXT_DETAIL =
  "Cada paso protege su cuenta y la participación de su comunidad. Mantenga sus datos actualizados.";
export const ACCESS_CONTEXT_USER = "María Quispe · Dpto 302 · Datos ficticios · PET (UTC−5)";

export const REGISTER_TITLE = "Cree su cuenta";
export const REGISTER_DESCRIPTION =
  "Use su correo para crear su acceso. Le enviaremos un código de verificación.";
export const REGISTER_PANEL_TITLE = "Registro con correo";
export const REGISTER_PANEL_DETAIL =
  "Su correo se usa solo para verificar su identidad y avisarle de votaciones.";
export const REGISTER_EMAIL_LABEL = "Correo electrónico";
export const REGISTER_PASSWORD_LABEL = "Contraseña";
export const REGISTER_CONSENT =
  "Acepto el tratamiento de mis datos para crear mi cuenta.";
export const REGISTER_SUBMIT = "Crear cuenta";
export const REGISTER_LOGIN_LINK = "Ya tengo cuenta - Iniciar sesión";
export const CONTINUE_LABEL = "Continuar";
export const REGISTER_FOOTNOTE =
  "Al crear su cuenta acepta las condiciones de uso y la política de privacidad.";
export const REGISTER_INVALID_EMAIL = "Revise su correo, parece incompleto.";
export const REGISTER_DUPLICATE =
  "Ese correo ya tiene una cuenta. Inicie sesión o recupere su acceso.";
export const REGISTER_TERMS_REQUIRED =
  "Debe aceptar el tratamiento de datos para continuar.";
export const REGISTER_CREATING = "Estamos creando su cuenta…";
export const REGISTER_CREATED_TITLE = "Cuenta creada";
export const REGISTER_CREATED_DETAIL =
  "Le enviamos un código de 6 dígitos. Ingréselo para verificar su correo.";

export const LOGIN_TITLE = "Inicio de sesión";
export const LOGIN_DESCRIPTION = "Acceda a su comunidad con seguridad.";
export const LOGIN_EMAIL_LABEL = "Correo electrónico";
export const LOGIN_PASSWORD_LABEL = "Contraseña";
export const LOGIN_SUBMIT = "Iniciar sesión";
export const LOGIN_CREATE_ACCOUNT = "Crear cuenta";
export const LOGIN_GOOGLE = "Continuar con Google";
export const LOGIN_RECOVER = "Olvidé mi contraseña";
export const LOGIN_REGISTER_PROMPT = "¿No tiene cuenta?";
export const LOGIN_REGISTER_LINK = "Cree una aquí";
export const LOGIN_FOOTNOTE =
  "También puede usar una identidad externa vinculada a su cuenta.";
export const LOGIN_FAILED =
  "No pudimos validar su acceso. Revise sus datos e intente de nuevo.";
export const LOGIN_LOCKED =
  "Bloqueamos su acceso por intentos reiterados. Intente de nuevo en unos minutos.";
export const LOGIN_SUSPENDED =
  "Su cuenta está suspendida. Comuníquese con soporte.";
export const LOGIN_PREVIOUS_SESSION =
  "Usted ya tiene una sesión abierta en otro dispositivo.";
export const LOGIN_OUTSIDE_NOT_LINKED =
  "Su correo aún no tiene una identidad externa vinculada. Ingrese con su correo o vincúlela primero.";
export const LOGIN_NETWORK_UNREACHABLE =
  "No hay conexión con el servidor. Verifique que el backend esté en marcha e intente de nuevo.";
export const LOGIN_CONFIRMED = "Acceso confirmado. Le llevamos a su inicio.";
export const LOGIN_RECOVERY_SENT =
  "Le enviamos instrucciones para recuperar su contraseña.";
export const LOGIN_RECOVERY_FAILED =
  "No pudimos iniciar la recuperación. Intente de nuevo más tarde.";

export const OTP_TITLE = "Verifique su correo";
export const OTP_DESCRIPTION =
  "Ingrese el código de 6 dígitos que le enviamos.";
export const OTP_NOTICE_TITLE = "Revise su bandeja";
export const OTP_NOTICE_DETAIL =
  "Si no lo ve, revise spam o pida un código nuevo. El código vence en unos minutos.";
export const OTP_VALIDITY = "Vigencia";
export const OTP_ATTEMPTS_LEFT = "intentos restantes";
export const OTP_EXPIRED = "El código expiró";
export const OTP_VERIFY = "Verificar código";
export const OTP_RESEND = "Reenviar código";
export const OTP_RESEND_NOTE =
  "Reenviar invalida el código anterior. Un código confirmado no se puede reutilizar.";
export const OTP_CONFIRMED_TITLE = "Correo verificado";
export const OTP_CONFIRMED_DETAIL =
  "Su correo quedó verificado. Ya puede continuar.";
export const OTP_FAILED = "Ese código no coincide. Revise e intente de nuevo.";
export const OTP_INVALIDATED =
  "Ese código ya no es válido porque pidió uno nuevo. Use el último.";
export const OTP_LOCKED =
  "Agotó sus intentos. Pida un código nuevo para continuar.";
export const OTP_RESENT = "Le enviamos un código nuevo.";

export const ACCOUNT_EYEBROW = "Miembro / Cuenta y seguridad";
export const ACCOUNT_TITLE = "Cuenta y seguridad";
export const ACCOUNT_DESCRIPTION = "Condominio Los Olivos · Santiago de Surco, Lima";
export const ACCOUNT_PANEL_TITLE = "María Quispe";
export const ACCOUNT_ACTIVE_BADGE = "ACTIVO";
export const ACCOUNT_VERIFIED_BADGE = "CORREO VERIFICADO";
export const ACCOUNT_EMAIL_LABEL = "Correo electrónico";
export const ACCOUNT_ROLES_LABEL = "Roles";
export const ACCOUNT_ROLES_VALUE = "Miembro";
export const ACCOUNT_EXTERNAL_LABEL = "Identidad externa";
export const ACCOUNT_EXTERNAL_VALUE = "Google · vinculada";
export const ACCOUNT_ACTIONS_TITLE = "Seguridad";
export const ACCOUNT_HISTORY_TITLE = "Historial de accesos";
export const ACCOUNT_CHANGE_PASSWORD = "Cambiar contraseña";
export const ACCOUNT_CHANGE_EMAIL = "Cambiar correo";
export const ACCOUNT_GOOGLE_LINK = "Vincular / desvincular Google";
export const ACCOUNT_SIGN_OUT = "Cerrar sesión";
export const ACCOUNT_PASSWORD_CHANGED =
  "Su contraseña se actualizó. Las demás sesiones se cerraron.";
export const ACCOUNT_EMAIL_PENDING =
  "Su nuevo correo está pendiente de verificación.";
export const ACCOUNT_NO_HISTORY = "Aún no hay movimientos en su cuenta.";
export const ACCOUNT_SECURITY_ERROR =
  "No pudimos completar esa acción de seguridad. Intente de nuevo.";
export const ACCOUNT_SUSPENDED_DETAIL =
  "Su cuenta está suspendida. No puede votar hasta rehabilitarla.";
export const ACCOUNT_UNVERIFIED_EMAIL =
  "Su correo aún no está verificado. Verifíquelo para continuar.";

export const USERS_TITLE = "Personas usuarias";
export const USERS_DESCRIPTION =
  "Busque, filtre y gestione accesos y roles.";
export const USERS_SEARCH_LABEL = "Buscar por nombre o correo";
export const USERS_ROLE_FILTER = "Rol";
export const USERS_STATUS_FILTER = "Estado";
export const USERS_EMPTY = "No encontramos personas con ese criterio.";
export const USERS_LOADING = "Estamos cargando la lista…";
export const USERS_ERROR =
  "No pudimos cargar la lista. Intente de nuevo.";
export const USERS_UPDATED = "Acceso actualizado correctamente.";
export const USERS_VIEW_PROFILE = "Ver perfil";

export const REQUEST_CODE_TITLE = "Solicite su código";
export const REQUEST_CODE_DESCRIPTION =
  "Le enviaremos un código de un solo uso para continuar.";
export const REQUEST_CODE_SENT_TITLE = "Código enviado";
export const REQUEST_CODE_SENT_DETAIL =
  "Revise su correo. El código vence en unos minutos y solo sirve una vez.";
export const REQUEST_CODE_SUBMIT = "Enviar código";
export const REQUEST_CODE_NO_CONTACT =
  "No tenemos un medio de contacto válido para usted. Actualice su correo.";
export const REQUEST_CODE_SENDING = "Estamos enviando su código…";
export const REQUEST_CODE_ERROR =
  "No pudimos enviar el código. Intente de nuevo.";

export const ENTER_CODE_TITLE = "Ingrese su código";
export const ENTER_CODE_LOADING = "Cargando verificación…";
export const ENTER_CODE_DESCRIPTION =
  "Use el código de 6 dígitos que le enviamos para continuar.";
export const ENTER_CODE_RECOVERY_VERIFIED =
  "Verificamos su identidad. Ya puede crear una contraseña nueva.";
export const NEW_SECRET_TITLE = "Cree su contraseña nueva";
export const NEW_SECRET_DESCRIPTION =
  "Ingrese la clave que usará desde ahora para acceder.";
export const NEW_SECRET_LABEL = "Contraseña nueva";
export const NEW_SECRET_SUBMIT = "Guardar contraseña";
export const NEW_SECRET_SAVED =
  "Contraseña actualizada. Ingrese con su clave nueva.";
export const NEW_SECRET_FAILED =
  "No pudimos guardar su contraseña. Pida un código nuevo e intente de nuevo.";

export const DOCUMENT_TITLE = "Verifique su documento";
export const DOCUMENT_DESCRIPTION =
  "Suba fotos nítidas de su documento para validar su identidad.";
export const DOCUMENT_NOTICE_TITLE = "Cuide la calidad de la foto";
export const DOCUMENT_NOTICE_DETAIL =
  "Evite reflejos, recortes y fotos borrosas. El documento debe estar vigente.";
export const DOCUMENT_TYPE_LABEL = "Tipo de documento";
export const DOCUMENT_FRONT_TITLE = "Anverso del documento";
export const DOCUMENT_BACK_TITLE = "Reverso del documento";
export const DOCUMENT_SELFIE_TITLE = "Foto de su rostro";
export const DOCUMENT_UPLOAD = "Subir foto";
export const DOCUMENT_SUBMIT = "Enviar documentos";
export const DOCUMENT_CONSENT =
  "Acepto el tratamiento de mi documento para verificar mi identidad.";
export const DOCUMENT_SENDING = "Estamos enviando sus documentos…";
export const DOCUMENT_SENT_TITLE = "Documentos recibidos";
export const DOCUMENT_SENT_DETAIL =
  "Revisaremos sus documentos y le avisaremos el resultado.";
export const DOCUMENT_NO_MEMBERSHIP =
  "Usted aún no tiene membresía activa para este proceso.";
export const DOCUMENT_NO_PERMISSION =
  "No tiene permiso para subir documentos en este momento.";
export const DOCUMENT_VALIDATION_ERROR =
  "Falta el reverso o alguna foto. Complete las tres fotos para continuar.";

export const DOCUMENT_RESULT_TITLE = "Resultado de su documento";
export const DOCUMENT_MATCH_TITLE = "Sus datos coinciden";
export const DOCUMENT_MATCH_DETAIL =
  "Su documento pasó la revisión. Ya puede continuar con la verificación biométrica.";
export const DOCUMENT_CONTINUE = "Continuar";
export const DOCUMENT_UNDER_REVIEW =
  "Sus documentos están en revisión. Le avisaremos cuando terminen.";
export const DOCUMENT_MISMATCH =
  "Sus datos no coinciden con el padrón. Revise y vuelva a intentarlo.";
export const DOCUMENT_EXPIRED_DOC =
  "Su documento está vencido. Suba uno vigente.";
export const DOCUMENT_UNREADABLE_BLURRY =
  "La foto está borrosa. Retome la foto con buena luz.";
export const DOCUMENT_UNREADABLE_GLARE =
  "La foto tiene reflejo. Retome la foto sin flash.";
export const DOCUMENT_UNREADABLE_CROPPED =
  "La foto está recortada. Incluya el documento completo.";
export const DOCUMENT_UNREADABLE_WRONG_TYPE =
  "El tipo de documento no corresponde. Elija el tipo correcto.";

export const BIOMETRIC_TITLE = "Cree su referencia biométrica";
export const BIOMETRIC_DESCRIPTION =
  "Usaremos su rostro solo para verificar que es usted al votar.";
export const BIOMETRIC_GUIDE = "Centre su rostro en el óvalo y mire al frente.";
export const BIOMETRIC_PRIVACY =
  "No guardamos fotos, solo una referencia técnica cifrada.";
export const BIOMETRIC_CAPTURE = "Tomar referencia";
export const BIOMETRIC_RETRY = "Reintentar";
export const BIOMETRIC_PROCESSING =
  "Estamos procesando su referencia. No cierre esta pantalla.";
export const BIOMETRIC_CREATED = "Referencia creada. Ya puede votar.";
export const BIOMETRIC_NO_PERMISSION =
  "Necesita permitir la cámara para continuar.";
export const BIOMETRIC_NO_DOCUMENT =
  "Primero valide su documento para crear su referencia.";

export const LIVENESS_TITLE = "Verifique que es usted";
export const LIVENESS_DESCRIPTION =
  "Siga la instrucción en pantalla sin moverse de su lugar.";
export const LIVENESS_LOOK = "Mire al frente";
export const LIVENESS_BLINK = "Parpadee despacio";
export const LIVENESS_TURN = "Gire levemente su rostro";
export const LIVENESS_COMPARING =
  "Estamos comparando con su referencia. Espere un momento.";
export const LIVENESS_VERIFIED = "Verificamos que es usted. Ya puede votar.";
export const LIVENESS_NOT_VERIFIED =
  "No pudimos verificarle. Intente de nuevo con buena luz.";
export const LIVENESS_EXPIRED_PRUEBA =
  "La prueba venció. Inicie una verificación nueva.";
export const LIVENESS_CONSENT =
  "Acepto el tratamiento de mi biometría para esta verificación.";
export const LIVENESS_START = "Iniciar verificación";
export const LIVENESS_CONTINUE = "Continuar";

export const VERIFICATION_STATUS_TITLE = "Su verificación";
export const VERIFICATION_ACTIVE_TITLE = "Su referencia está activa";
export const VERIFICATION_ACTIVE_DETAIL =
  "Puede votar mientras su referencia siga vigente.";
export const VERIFICATION_GO_VOTE = "Ir a votar";
export const VERIFICATION_NONE =
  "Usted aún no tiene referencia biométrica. Cree una para votar.";
export const VERIFICATION_FRESH = "Su verificación está vigente.";
export const VERIFICATION_STALE =
  "Su verificación venció. Realice una prueba de vida nueva.";
export const VERIFICATION_NO_HISTORY =
  "Aún no hay verificaciones registradas.";

export const TALLY_TITLE = "Cierre y escrutinio";
export const TALLY_ONLY_CONFIRMED_TITLE = "Solo votos Confirmados cuentan";
export const TALLY_ONLY_CONFIRMED_DETAIL =
  "No se cuentan autorizaciones, firmas, votos en cola ni enviados. El escrutinio es solo sobre Confirmados en blockchain.";
export const TALLY_AUDIT_TITLE = "Auditoría del proceso";
export const TALLY_CLOSE_STEP_1_TITLE = "¿Cerrar la propuesta?";
export const TALLY_CLOSE_STEP_1_DETAIL =
  "Paso 1 de 2. Dejará de recibir votos; se iniciará el escrutinio automático.";
export const TALLY_CLOSE_STEP_2_TITLE = "Confirme el cierre irreversible";
export const TALLY_CLOSE_STEP_2_DETAIL =
  "Paso 2 de 2. Entiendo que el cierre es irreversible y solo los votos Confirmados se contarán.";
export const TALLY_REASON_LABEL = "Motivo del cierre";
export const TALLY_CLOSE_CONFIRM = "Cerrar propuesta";
export const TALLY_CLOSE_CANCEL = "Volver";
export const TALLY_CLOSED = "Propuesta cerrada. Escrutinio registrado.";
export const TALLY_OPTION_SI_LABEL = "Sí";
export const TALLY_OPTION_NO_LABEL = "No";
export const TALLY_OPTION_ABSTENCION_LABEL = "Abstención";
export const TALLY_FROZEN_RULE_SERVER =
  "Escrutinio del servidor sobre votos Confirmados; el padrón de elegibles lo define su comunidad.";
export const NAV_ADMIN_PANEL = "Panel";
export const NAV_ADMIN_PADRON = "Padrón";
export const NAV_ADMIN_PROPOSALS = "Propuestas";
export const NAV_ADMIN_COMMUNITY = "Comunidad";
