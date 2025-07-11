import { Module } from '@nestjs/common'

import { BlogTreeNodeController } from './blog-tree-node.controller'
import { BlogTreeNodeService } from './blog-tree-node.service'

@Module({
  imports: [],
  controllers: [BlogTreeNodeController],
  providers: [BlogTreeNodeService],
})
export class BlogTreeNodeModule {}
