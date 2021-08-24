import { Skeleton, VStack } from "@chakra-ui/react";
import { nanoid } from "nanoid";

interface ItemsSkeletonProps {
  height: string;
  count?: number;
}

const ItemsSkeleton = ({
  height,
  count = 3,
}: ItemsSkeletonProps): JSX.Element => (
  <VStack width="100%">
    {new Array(count).fill(0).map(() => {
      const key = nanoid();
      return <Skeleton height={height} width="100%" key={key} />;
    })}
  </VStack>
);

ItemsSkeleton.defaultProps = {
  count: 3,
};

export default ItemsSkeleton;
