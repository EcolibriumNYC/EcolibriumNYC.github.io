// secret.c: a tiny password checker to take apart
#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[]) {
  if (argc > 1 && strcmp(argv[1], "ecolibrium") == 0) {
    printf("Access granted\n");
  } else {
    printf("Wrong password\n");
  }
  return 0;
}
