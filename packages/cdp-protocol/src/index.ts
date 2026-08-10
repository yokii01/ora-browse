/**
 * ORA Browse v1.5 - CDP Protocol Implementation
 * Chrome DevTools Protocol support for advanced browser control
 */

import type { BrowserConfig } from '@ora/browser-core';

// CDP Command types
export interface CDPCommand {
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

export interface CDPResponse {
  id: number;
  result?: Record<string, unknown>;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface CDPEvent {
  method: string;
  params?: Record<string, unknown>;
  sessionId?: string;
}

// CDP Domains
export namespace CDP {
  export namespace DOM {
    export interface GetDocumentParams {
      depth?: number;
      pierce?: boolean;
    }
    
    export interface QuerySelectorParams {
      nodeId: number;
      selector: string;
    }
    
    export interface QuerySelectorAllParams {
      nodeId: number;
      selector: string;
    }
    
    export interface GetOuterHTMLParams {
      nodeId?: number;
      backendNodeId?: number;
      objectId?: string;
    }
    
    export interface SetOuterHTMLParams {
      nodeId: number;
      outerHTML: string;
    }
    
    export interface Node {
      nodeId: number;
      backendNodeId: number;
      frontendNodeId?: number;
      nodeType: number;
      nodeName: string;
      localName: string;
      nodeValue: string;
      childNodeCount?: number;
      children?: Node[];
      attributes?: string[];
      documentURL?: string;
      baseURL?: string;
      publicId?: string;
      systemId?: string;
      xmlVersion?: string;
      frameId?: string;
      contentDocument?: Node;
      shadowRoots?: Node[];
      pseudoType?: string;
      pseudoIdentifier?: string;
      isClickable?: boolean;
      currentSourceURL?: string;
      origin?: string;
      pseudoElements?: Node[];
      importedDocument?: Node;
      distributedNodes?: BackendNode[];
    }
    
    export interface BackendNode {
      nodeType: number;
      nodeName: string;
      backendNodeId: number;
    }
  }
  
  export namespace Runtime {
    export interface EvaluateParams {
      expression: string;
      objectGroup?: string;
      includeCommandLineAPI?: boolean;
      silent?: boolean;
      returnByValue?: boolean;
      generatePreview?: boolean;
      awaitPromise?: boolean;
      userGesture?: boolean;
      allowUnsafeEvalBlockedByCSP?: boolean;
      serializationOptions?: SerializationOptions;
    }
    
    export interface SerializationOptions {
      serialization: 'deep' | 'json';
      maxDepth?: number;
      includeShadowTree?: 'none' | 'open' | 'all';
      omitObjectPrototype?: boolean;
      includeDomSymbols?: boolean;
    }
    
    export interface RemoteObject {
      type: 'object' | 'function' | 'undefined' | 'string' | 'number' | 'boolean' | 'symbol' | 'bigint';
      subtype?: 'array' | 'null' | 'node' | 'regexp' | 'date' | 'map' | 'set' | 'weakmap' | 'weakset' | 'iterator' | 'generator' | 'error' | 'proxy' | 'promise' | 'typedarray' | 'arraybuffer' | 'dataview' | 'webassemblymemory' | 'wasmvalue';
      className?: string;
      value?: unknown;
      description?: string;
      preview?: ObjectPreview;
      objectId?: string;
      unserializableValue?: string;
    }
    
    export interface ObjectPreview {
      type: string;
      subtype?: string;
      description?: string;
      overflow: boolean;
      properties: PropertyPreview[];
      entries?: EntryPreview[];
      length?: number;
    }
    
    export interface PropertyPreview {
      name: string;
      type: string;
      value?: string;
      valuePreview?: ObjectPreview;
      subtype?: string;
    }
    
    export interface EntryPreview {
      key: PropertyPreview;
      value: PropertyPreview;
    }
  }
  
  export namespace Page {
    export interface NavigateParams {
      url: string;
      referrer?: string;
      transitionType?: 'Link' | 'Typed' | 'Form' | 'Reload' | 'Bookmarked' | 'AutoBookmark' | 'AutoSubframe' | 'ManualSubframe' | 'AddressBar' | 'FormSubmit' | 'Other';
      frameId?: string;
    }
    
    export interface ReloadParams {
      ignoreCache?: boolean;
      scriptToEvaluateOnLoad?: string;
    }
    
    export interface CaptureScreenshotParams {
      format?: 'jpeg' | 'png';
      quality?: number;
      clip?: Viewport;
      fromSurface?: boolean;
      captureBeyondViewport?: boolean;
    }
    
    export interface Viewport {
      x: number;
      y: number;
      width: number;
      height: number;
      scale: number;
    }
    
    export interface PrintToPDFOptions {
      landscape?: boolean;
      displayHeaderFooter?: boolean;
      printBackground?: boolean;
      scale?: number;
      paperWidth?: number;
      paperHeight?: number;
      marginTop?: number;
      marginBottom?: number;
      marginLeft?: number;
      marginRight?: number;
      pageRanges?: string;
      headerTemplate?: string;
      footerTemplate?: string;
      preferCSSPageSize?: boolean;
      generateTaggedPDF?: boolean;
      generateDocumentOutline?: boolean;
      transferMode?: 'ReturnAsBase64' | 'ReturnAsStream';
    }
    
    export interface EmulateMediaParams {
      media?: 'screen' | 'print' | 'none';
      colorScheme?: 'light' | 'dark' | 'no-preference' | 'forced-colors';
      reducedMotion?: 'reduce' | 'no-preference';
      forcedColors?: 'active' | 'none';
    }
    
    export interface SetDeviceMetricsOverrideParams {
      width: number;
      height: number;
      deviceScaleFactor: number;
      mobile: boolean;
      scale?: number;
      screenWidth?: number;
      screenHeight?: number;
      positionX?: number;
      positionY?: number;
      fitWindow?: boolean;
      screenOrientation?: { type: 'portraitPrimary' | 'landscapePrimary' | 'portraitSecondary' | 'landscapeSecondary'; angle: number };
      viewport?: { x: number; y: number; width: number; height: number; scale: number };
    }
    
    export interface AddScriptToEvaluateOnNewDocumentParams {
      source: string;
      worldName?: string;
      includeCommandLineAPI?: boolean;
      runImmediately?: boolean;
    }
  }
  
  export namespace Network {
    export interface SetExtraHTTPHeadersParams {
      headers: Record<string, string>;
    }
    
    export interface SetUserAgentOverrideParams {
      userAgent: string;
      acceptLanguage?: string;
      platform?: string;
      userAgentMetadata?: UserAgentMetadata;
    }
    
    export interface UserAgentMetadata {
      brands: { brand: string; version: string }[];
      fullVersion?: string;
      platform?: string;
      platformVersion?: string;
      architecture?: string;
      model?: string;
      mobile?: boolean;
      wow64?: boolean;
      bitness?: string;
      wowAarch64?: boolean;
    }
    
    export interface EnableParams {
      maxTotalBufferSize?: number;
      maxResourceBufferSize?: number;
      maxPostDataSize?: number;
    }
    
    export interface RequestWillBeSentEvent {
      requestId: string;
      loaderId: string;
      timestamp: number;
      initiator?: Initiator;
      redirectHash?: string;
      redirectedResponse?: Response;
      type?: 'Document' | 'Stylesheet' | 'Image' | 'Media' | 'Font' | 'Script' | 'TextTrack' | 'XHR' | 'Fetch' | 'Prefetch' | 'EventSource' | 'WebSocket' | 'Manifest' | 'SignedExchange' | 'Ping' | 'CSPViolationReport' | 'Preflight' | 'Other';
      request: Request;
      frameId?: string;
      hasUserGesture?: boolean;
    }
    
    export interface Request {
      url: string;
      method: string;
      headers: Record<string, string>;
      postData?: string;
      mixedContentType?: 'blockable' | 'optionally-blockable' | 'none';
      initialPriority: 'VeryLow' | 'Low' | 'Medium' | 'High' | 'VeryHigh';
      referrerPolicy: 'unsafe-url' | 'no-referrer-when-downgrade' | 'no-referrer' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin';
      isLinkPreload?: boolean;
      trustTokenParams?: TrustTokenParams;
    }
    
    export interface Initiator {
      type: 'parser' | 'script' | 'preload' | 'preflight' | 'other';
      stack?: StackTrace;
      requestId?: string;
      url?: string;
      lineNumber?: number;
      columnNumber?: number;
    }
    
    export interface StackTrace {
      callFrames: CallFrame[];
      parent?: StackTrace;
      parentId?: { id: string; debuggerId?: string };
    }
    
    export interface CallFrame {
      functionName: string;
      scriptId: string;
      url: string;
      lineNumber: number;
      columnNumber: number;
    }
    
    export interface ResponseReceivedEvent {
      requestId: string;
      loaderId: string;
      timestamp: number;
      type: 'Document' | 'Stylesheet' | 'Image' | 'Media' | 'Font' | 'Script' | 'TextTrack' | 'XHR' | 'Fetch' | 'Prefetch' | 'EventSource' | 'WebSocket' | 'Manifest' | 'SignedExchange' | 'Ping' | 'CSPViolationReport' | 'Preflight' | 'Other';
      response: Response;
      frameId?: string;
      redirectHasExtraInfo?: boolean;
    }
    
    export interface Response {
      url: string;
      status: number;
      statusText: string;
      headers: Record<string, string>;
      headersText?: string;
      mimeType?: string;
      requestHeaders?: Record<string, string>;
      requestHeadersText?: string;
      connectionReused: boolean;
      connectionId: number;
      remoteIPAddress?: string;
      remotePort?: number;
      fromDiskCache?: boolean;
      fromServiceWorker?: boolean;
      fromPrefetchCache?: boolean;
      encodedDataLength: number;
      timing?: ResourceTiming;
      responseTime?: number;
      cacheStorageCacheName?: string;
      protocol?: string;
      securityState: 'unknown' | 'neutral' | 'insecure' | 'secure' | 'info' | 'insecureBroken';
      securityDetails?: SecurityDetails;
      body?: string;
    }
    
    export interface ResourceTiming {
      requestTime: number;
      proxyStart: number;
      proxyEnd: number;
      dnsStart: number;
      dnsEnd: number;
      connectStart: number;
      connectEnd: number;
      sslStart: number;
      sslEnd: number;
      workerStart: number;
      workerReady: number;
      workerFetchStart: number;
      workerRespondWithSettled: number;
      sendStart: number;
      sendEnd: number;
      pushStart: number;
      pushEnd: number;
      receiveHeadersEnd: number;
    }
    
    export interface SecurityDetails {
      protocol: string;
      subjectName: string;
      issuer: string;
      validFrom: number;
      validTo: number;
      certificateId: number;
      certificateTransparencyCompliance: 'unknown' | 'compliant' | 'not-compliant';
      signedCertificateTimestampList?: SignedCertificateTimestamp[];
      certificateNetworkError?: string;
      isDHELessKeyExchange?: boolean;
      keyExchange?: string;
      keyExchangeGroup?: string;
      cipher?: string;
      mac?: string;
    }
    
    export interface SignedCertificateTimestamp {
      status: 'unknown' | 'invalid' | 'valid';
      source: 'embedded-in-certIFICATE' | 'embedded-in-ocsp-response' | 'embedded-in-sct-list' | 'provided-by-peer';
      logDescription: string;
      logId: string;
      timestamp: number;
      hashAlgorithm: 'none' | 'md5' | 'sha1' | 'sha256';
      signatureAlgorithm: 'anonymous' | 'rsa' | 'dsa' | 'ecdsa';
      signatureData: string;
      origin?: 'embedded-in-certIFICATE' | 'embedded-in-ocsp-response' | 'embedded-in-sct-list' | 'provided-by-peer';
      verifiedSCCTInCert?: boolean;
    }
    
    export interface TrustTokenParams {
      operation: 'Sign' | 'Redeem' | 'Refresh';
      topLevelSite: string;
      isMatchingAcrossSites: boolean;
      issuers?: string[];
    }
  }
  
  export namespace Input {
    export interface DispatchKeyEventParams {
      type: 'keyDown' | 'keyUp' | 'rawKeyDown' | 'char';
      windowsVirtualKeyCode?: number;
      nativeVirtualKeyCode?: number;
      autoRepeat?: boolean;
      isKeypad?: boolean;
      isSystemKey?: boolean;
      location?: number;
      text?: string;
      unmodifiedText?: string;
      key?: string;
      code?: string;
      timestamp?: number;
      commands?: string[];
    }
    
    export interface DispatchMouseEventParams {
      type: 'mousePressed' | 'mouseReleased' | 'mouseMoved';
      x: number;
      y: number;
      modifiers?: number;
      button?: 'none' | 'left' | 'right' | 'middle' | 'back' | 'forward';
      buttons?: number;
      clickCount?: number;
      force?: number;
      tangentialPressure?: number;
      tiltX?: number;
      tiltY?: number;
      twist?: number;
      deltaX?: number;
      deltaY?: number;
      pointerType?: 'mouse' | 'pen';
      timeStamp?: number;
    }
    
    export interface DispatchTouchEventParams {
      type: 'touchStart' | 'touchEnd' | 'touchMove' | 'touchCancel';
      touchPoints: TouchPoint[];
      modifiers?: number;
      timeStamp?: number;
    }
    
    export interface TouchPoint {
      x: number;
      y: number;
      radiusX?: number;
      radiusY?: number;
      rotationAngle?: number;
      force?: number;
      tangentialPressure?: number;
      tiltX?: number;
      tiltY?: number;
      twist?: number;
      id?: number;
    }
    
    export interface InsertTextParams {
      text: string;
    }
    
    export interface SynthesizePinchGestureParams {
      x: number;
      y: number;
      scaleFactor: number;
      relativeSpeed?: number;
      gestureSourceType?: 'default' | 'touch' | 'mouse';
      smooth?: boolean;
    }
    
    export interface SynthesizeScrollGestureParams {
      x: number;
      y: number;
      xDistance?: number;
      yDistance?: number;
      xOverscroll?: number;
      yOverscroll?: number;
      repeatCount?: number;
      delay?: number;
      preventFling?: boolean;
      speed?: number;
      gestureSourceType?: 'default' | 'touch' | 'mouse';
      repeatDelayMs?: number;
      marker?: string;
    }
  }
  
  export namespace Emulation {
    export interface SetGeolocationOverrideParams {
      latitude: number;
      longitude: number;
      accuracy?: number;
    }
    
    export interface SetTouchEmulationEnabledParams {
      enabled: boolean;
      configuration?: 'mobile' | 'desktop';
      maxTouchPoints?: number;
    }
    
    export interface SetCPUThrottlingRateParams {
      rate: number;
    }
    
    export interface SetDefaultBackgroundColorOverrideParams {
      color?: { r: number; g: number; b: number; a?: number };
    }
    
    export interface SetIdleOverrideParams {
      isUserActive: boolean;
      isScreenUnlocked: boolean;
    }
    
    export interface SetLocaleOverrideParams {
      locale: string;
    }
    
    export interface SetTimezoneOverrideParams {
      timezoneId: string;
    }
    
    export interface SetVisibleSizeParams {
      bounds: { left: number; top: number; width: number; height: number };
    }
    
    export interface SetOfflineModeOverridesParams {
      offline: boolean;
      latency?: number;
      downloadThroughput?: number;
      uploadThroughput?: number;
    }
  }
  
  export namespace Storage {
    export interface GetCookiesParams {
      browserContextId?: string;
    }
    
    export interface SetCookieParams {
      name: string;
      value: string;
      url?: string;
      domain?: string;
      path?: string;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
      expires?: number;
      priority?: 'Low' | 'Medium' | 'High';
      sameParty?: boolean;
      sourceScheme?: 'Unset' | 'NonSecure' | 'Secure';
      sourcePort?: number;
      partitionKey?: { topLevelSite: string; hasCrossSiteAncestor: boolean };
    }
    
    export interface DeleteCookieParams {
      name: string;
      url?: string;
      domain?: string;
      path?: string;
      partitionKey?: { topLevelSite: string; hasCrossSiteAncestor: boolean };
    }
    
    export interface ClearDataParams {
      since: number;
      storageTypes?: string[];
      origins?: Origin[];
    }
    
    export interface Origin {
      origin: string;
      type: 'protected' | 'normal';
    }
    
    export interface GetUsageAndQuotaParams {
      origin: string;
    }
    
    export interface OverrideQuotaForOriginParams {
      origin: string;
      quotaSize?: number;
    }
    
    export interface TrackCacheStorageForOriginParams {
      origin: string;
    }
    
    export interface TrackIndexedDBForOriginParams {
      origin: string;
    }
  }
  
  export namespace Fetch {
    export interface EnableParams {
      patterns?: RequestPattern[];
      handleAuthRequests?: boolean;
    }
    
    export interface RequestPattern {
      urlPattern?: string;
      resourceType?: 'Document' | 'Stylesheet' | 'Image' | 'Media' | 'Font' | 'Script' | 'TextTrack' | 'XHR' | 'Fetch' | 'Prefetch' | 'EventSource' | 'WebSocket' | 'Manifest' | 'SignedExchange' | 'Ping' | 'CSPViolationReport' | 'Preflight' | 'Other';
      requestStage?: 'Request' | 'Response';
    }
    
    export interface ContinueRequestParams {
      requestId: string;
      url?: string;
      method?: string;
      postData?: string;
      headers?: Record<string, string>;
      interceptResponse?: boolean;
    }
    
    export interface FulfillRequestParams {
      requestId: string;
      responseCode?: number;
      responseHeaders?: HeaderEntry[];
      binaryResponseHeaders?: BinaryHeaderEntry[];
      responseBody?: string;
      responsePhrase?: string;
    }
    
    export interface FailRequestParams {
      requestId: string;
      errorReason: 'Failed' | 'Aborted' | 'TimedOut' | 'AccessDenied' | 'ConnectionClosed' | 'ConnectionReset' | 'ConnectionRefused' | 'ConnectionAborted' | 'ConnectionFailed' | 'NameNotResolved' | 'InternetDisconnected' | 'AddressUnreachable' | 'BlockedByClient' | 'BlockedByAdmin';
    }
    
    export interface ContinueWithAuthParams {
      requestId: string;
      authChallengeResponse?: { response: 'Default' | 'CancelAuth' | 'ProvideCredentials'; username?: string; password?: string };
    }
    
    export interface HeaderEntry {
      name: string;
      value: string;
    }
    
    export interface BinaryHeaderEntry {
      name: string;
      value: number[];
    }
  }
  
  export namespace Log {
    export interface EnableParams {
      include?: string[];
    }
    
    export interface EntryAddedEvent {
      entry: LogEntry;
    }
    
    export interface LogEntry {
      source: 'xml' | 'javascript' | 'network' | 'console-api' | 'storage' | 'appcache' | 'rendering' | 'security' | 'deprecation' | 'worker' | 'violation' | 'intervention' | 'recommendation' | 'other';
      level: 'verbose' | 'info' | 'warning' | 'error';
      text: string;
      timestamp: number;
      url?: string;
      lineNumber?: number;
      stackTrace?: StackTrace;
      networkRequestId?: string;
      workerId?: string;
      args?: Runtime.RemoteObject[];
      trace?: string;
      asyncStackTrace?: AsyncStackTrace;
      consoleApiVersion?: number;
    }
    
    export interface AsyncStackTrace {
      description: string;
      callFrames: CallFrame[];
      parent?: AsyncStackTrace;
      parentId?: { id: string; debuggerId?: string };
    }
  }
  
  export namespace Performance {
    export interface EnableParams {
      timeDomain?: string;
      metricTypes?: MetricType[];
    }
    
    export type MetricType = 'all' | 'timing' | 'resource' | 'paint' | 'layout' | 'js' | 'gc';
    
    export interface GetMetricsParams {
      timeDomain?: string;
    }
    
    export interface MetricsEvent {
      title: string;
      value: number;
      units: string;
      source: 'navigation' | 'paint' | 'layout' | 'js' | 'gc' | 'other';
      timestamp?: number;
    }
  }
  
  export namespace Accessibility {
    export interface EnableParams {
      accessibleEvents?: boolean;
    }
    
    export interface GetFullAXTreeParams {
      depth?: number;
      fetchRelatives?: boolean;
    }
    
    export interface AXTreeNode {
      nodeId: string;
      ignored?: boolean;
      ignoredReasons?: IgnoredReason[];
      role?: Role;
      chromeRole?: Role;
      name?: PropertyValue;
      description?: PropertyValue;
      value?: PropertyValue;
      properties?: Property[];
      childIds?: string[];
      backendDOMNodeId?: number;
      frameId?: string;
    }
    
    export interface Role {
      type: 'role' | 'internal_role';
      value: string;
    }
    
    export interface PropertyValue {
      type: 'string' | 'boolean' | 'idref' | 'idref_list' | 'integer' | 'int_array' | 'node' | 'nodeList' | 'number' | 'any' | 'dom_node' | 'css_style' | 'color_value' | 'image' | 'computed_string';
      value: unknown;
    }
    
    export interface Property {
      name: string;
      value: PropertyValue;
    }
    
    export interface IgnoredReason {
      reason: 'ariaHidden' | 'ariaInvalid' | 'ariaRoleNone' | 'childrenPresentational' | 'classHidden' | 'displayNone' | 'emptyAlt' | 'focusable' | 'hidden' | 'implicitLabel' | 'inert' | 'inputImageAltText' | 'labelEmpty' | 'landmark' | 'nativeControl' | 'negativeTabIndex' | 'noAutofocus' | 'nonFocusable' | 'notContentEditable' | 'notRelatedElement' | 'other' | 'outsideBoundary' | 'presentation' | 'redundant' | 'tabIndexNegative' | 'uninteresting' | 'unsupportedAction' | 'visibilityHidden' | 'zeroArea';
      nodes?: BackendNode[];
    }
  }
  
  export namespace Tracing {
    export interface StartParams {
      categories: string;
      options?: string;
      bufferUsageReportingInterval?: number;
      transferMode?: 'ReportEvents' | 'ReturnAsStream';
      streamFormat?: 'json' | 'proto';
      compression?: 'none' | 'gz';
      memoryDumpConfig?: MemoryDumpConfig;
      enableArgumentFilter?: boolean;
      includedCategories?: string[];
      excludedCategories?: string[];
      syntheticDelays?: string[];
      durationToCall?: number;
      disableStackSampling?: boolean;
      useWebAudioBuffer?: boolean;
      perfettoConfig?: string;
      enableBuiltInTracing?: boolean;
    }
    
    export interface MemoryDumpConfig {
      deterministic: boolean;
      anonymizeStacks: boolean;
      enablePrivateMemory: boolean;
      includeLightweightAllocations: boolean;
    }
    
    export interface EndParams {
      transferMode?: 'ReportEvents' | 'ReturnAsStream';
      streamFormat?: 'json' | 'proto';
      compression?: 'none' | 'gz';
    }
    
    export interface DataCollectedEvent {
      value: unknown[];
    }
    
    export interface TracingCompleteEvent {
      stream?: string;
      traceFormat?: 'json' | 'proto';
      streamCompression?: 'none' | 'gz';
    }
  }
}

// CDP Session Interface
export interface CDPSession {
  send<T = Record<string, unknown>>(method: string, params?: Record<string, unknown>): Promise<T>;
  on(event: string, listener: (params: Record<string, unknown>) => void): this;
  once(event: string, listener: (params: Record<string, unknown>) => void): this;
  off(event: string, listener: (params: Record<string, unknown>) => void): this;
  detach(): Promise<void>;
}

// CDP Client Options
export interface CDPClientOptions {
  host?: string;
  port?: number;
  secure?: boolean;
  timeout?: number;
  autoConnect?: boolean;
  reconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

// CDP Connection Info
export interface CDPConnectionInfo {
  webSocketDebuggerUrl: string;
  devtoolsFrontendUrl: string;
  type: 'page' | 'service_worker' | 'browser' | 'iframe' | 'other';
  description: string;
  title: string;
  url: string;
  faviconUrl?: string;
  id: string;
  vmId?: string;
  lifecycle?: {
    networkIdle: boolean;
    domContentLoaded: boolean;
    load: boolean;
  };
}

// CDP Browser Info
export interface CDPBrowserInfo {
  protocolVersion: string;
  product: string;
  revision: string;
  userAgent: string;
  jsVersion: string;
  arch?: string;
  platform?: string;
  wsEndpoint?: string;
}

// Helper functions
export function createCDPCommand(method: string, params?: Record<string, unknown>, id?: number): CDPCommand {
  return {
    id: id ?? Date.now(),
    method,
    params,
  };
}

export function isCDPError(response: CDPResponse): response is CDPResponse & { error: NonNullable<CDPResponse['error']> } {
  return 'error' in response && response.error !== undefined;
}

export function parseCDPUrl(url: string): { host: string; port: number; secure: boolean } {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port, 10) || (parsed.protocol === 'wss:' ? 443 : 80),
      secure: parsed.protocol === 'wss:',
    };
  } catch {
    return { host: 'localhost', port: 9222, secure: false };
  }
}

export const CDP_DEFAULT_PORT = 9222;
export const CDP_DEFAULT_HOST = 'localhost';
export const CDP_PROTOCOL_VERSION = '1.3';
