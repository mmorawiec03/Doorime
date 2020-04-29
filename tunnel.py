from sshtunnel import SSHTunnelForwarder
import time


server = SSHTunnelForwarder(
    'pluton.kt.agh.edu.pl',
    ssh_username="",
    ssh_password="",
    remote_bind_address=('127.0.0.1', 55555),
    local_bind_address=('127.0.0.1', 54321)
)

server.stop()
server.start()
print("[INFO] Server started on port ", server.local_bind_port)

while True:
	if not server.is_active:
		print("[INFO] Tunnel restarting")
		try:
			server.stop()
			server.start()
			print("[INFO] Running on port ", server.local_bind_port)
		except:
			print('[ERROR] No connection')
			time.sleep(2)
	time.sleep(3)
