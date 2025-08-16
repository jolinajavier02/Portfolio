import time
import sys

ascii_art = r"""
     ██╗ ██████╗ ██╗     ██╗███╗   ██╗ █████╗       ██╗ █████╗ ██╗   ██╗██╗███████╗██████╗ 
     ██║██╔═══██╗██║     ██║████╗  ██║██╔══██╗      ██║██╔══██╗██║   ██║██║██╔════╝██╔══██╗
     ██║██║   ██║██║     ██║██╔██╗ ██║███████║      ██║███████║██║   ██║██║█████╗  ██████╔╝
██   ██║██║   ██║██║     ██║██║╚██╗██║██╔══██║ ██   ██║██╔══██║╚██╗ ██╔╝██║██╔══╝  ██╔══██╗
╚█████╔╝╚██████╔╝███████╗██║██║ ╚████║██║  ██║ ╚█████╔╝██║  ██║ ╚████╔╝ ██║███████╗██║  ██║
 ╚════╝  ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝  ╚════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝╚══════╝╚═╝  ╚═╝
"""

def typewriter(text, delay=0.002):  # delay = typing speed
    for line in text.splitlines():
        for char in line:
            sys.stdout.write(char)
            sys.stdout.flush()
            time.sleep(delay)
        sys.stdout.write("\n")
        sys.stdout.flush()
    print("\n")

while True:
    typewriter(ascii_art, 0.0015)  # Faster typing
    time.sleep(1)  # Pause before repeating
    sys.stdout.write("\033c")  # Clears screen for loop effect