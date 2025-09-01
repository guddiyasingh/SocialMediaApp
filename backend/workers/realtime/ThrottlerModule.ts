import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { ttl: 60_000, limit: 5 } })
@Post('login')
login(...) { ... }
