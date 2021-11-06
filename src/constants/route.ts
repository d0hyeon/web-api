type Route = {
  url: string;
  path: string;
  title?: string;
}

export const ROUTES: Route[] = [
  {title: 'BroadCast Channel', url: '/broadcast', path: '/Broadcast'},
  {url: '/broadcast/:channelId', path: '/Broadcast/detail'},
  {title: 'Background Task', url: '/background', path: '/BackgroundTask'},
  {title: 'Resize Observer', url: '/resize', path: '/ResizeObserver'},
  {title: 'Performance', url: '/performance', path: '/Performance'},
  {title: 'PerformanceObserver', url: '/performance/observer', path: '/Performance/Observer'},
  {title: 'MediaStream', url: '/media', path: '/MediaStream'},
  {title: 'MediaStreamTrack', url: '/media/track', path: '/MediaStream/Track'},
  {title: 'MediaDevices', url: '/media/devices', path: '/MediaStream/Devices'},
  {title: 'WebRTC(local)', url: '/webrtc/local', path: '/WebRTC/Local'},
  {title: 'WebRTC(remote)', url: '/webrtc/remote', path: '/WebRTC/Remote/'},
  {url: '/webrtc/remote/:room', path: '/WebRTC/Remote/Detail'},
  {title: 'WebGL', url: '/webgl', path: '/WebGL'},
  {title: 'Canvas', url: '/canvas', path: '/Canvas'},
  {title: 'Notification', url: '/notification', path: '/Notification'}
]